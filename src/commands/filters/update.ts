import { Flags } from "@oclif/core";
import { Filter, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { FilterColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class Update extends BaseCommand {
    static description = 'Updates an existing filter, and returns its new value. ' + UX.processDocumentation('<doc:Filter>');
    static examples = [
        `$ jiraserver filters:update -a "MyAlias" --filter "theFilterId" --data "{'id':'customfield_10000','name':'New custom field','description':'Custom field for picking groups','type':'com.atlassian.jira.plugin.system.customfieldtypes:grouppicker','searcherKey':'com.atlassian.jira.plugin.system.customfieldtypes:grouppickersearcher'}" --json`,
        `$ jiraserver filters:update -a "MyAlias" --filter "theFilterId" --file "path/to/the/json/data/file" --csv`,
        `$ jiraserver filters:update -a "MyAlias" --filter "theFilterId" --file "path/to/the/json/data/file"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        expand: BuildFlags.expand(),
        data: BuildFlags.input.jsonData('<doc:FilterInput>'),
        file: BuildFlags.input.jsonFile('<doc:FilterInput>'),
        filter: Flags.string({
            description: 'The Filter Id to update',
            required: true,
            name: 'Filter Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<Filter>> {
        const response = new JiraCLIResponse<Filter>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.filters.update(this.flags.filter, this.getJSONInputData(), this.flags.expand);
            response.result = result
            response.status = 0;
            response.message = this.getRecordUpdatedText('Filter');
            this.ux.log(response.message);
            this.ux.table<Filter>([result], FilterColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}