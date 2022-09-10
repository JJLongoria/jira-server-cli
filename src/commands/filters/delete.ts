import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";

export default class Delete extends BaseCommand {
    static description = 'Delete a filter.';
    static examples = [
        `$ jiraserver filters:delete -a "MyAlias" --filter "theFilterId" --json`,
        `$ jiraserver filters:delete -a "MyAlias" --filter "theFilterId" --csv`,
        `$ jiraserver filters:delete -a "MyAlias" --filter "theFilterId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        filter: Flags.string({
            description: 'The Filter Id to delete',
            required: true,
            name: 'Filter Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.filters.delete(this.flags.filter);
            response.status = 0;
            response.message = this.getRecordDeletedText('Filter');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}