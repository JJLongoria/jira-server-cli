import { Flags } from "@oclif/core";
import { Group, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { GroupColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class Create extends BaseCommand {
    static description = 'Creates a group by given group parameter. ' + UX.processDocumentation('<doc:Group>');
    static examples = [
        `$ jiraserver groups:create -a "MyAlias" --name "theGroupName" --json`,
        `$ jiraserver groups:create -a "MyAlias" --name "theGroupName" --csv`,
        `$ jiraserver groups:create -a "MyAlias" --name "theGroupName"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        name: Flags.string({
            description: 'The group name to create',
            required: true,
            name: 'Name',
        }),
    };
    async run(): Promise<JiraCLIResponse<Group>> {
        const response = new JiraCLIResponse<Group>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.groups.create(this.flags.name);
            response.result = result
            response.status = 0;
            response.message = this.getRecordCreatedText('Filter');
            this.ux.log(response.message);
            this.ux.table<Group>([result], GroupColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}