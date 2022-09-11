import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";

export default class Delete extends BaseCommand {
    static description = 'Delete an issue. If the issue has subtasks you must set the flag --subtasks to delete the issue. You cannot delete an issue without its subtasks also being deleted.';
    static examples = [
        `$ jiraserver issues:delete -a "MyAlias" --issue "theIssueKeyOrId" --json`,
        `$ jiraserver issues:delete -a "MyAlias" --issue "theIssueKeyOrId" --subtasks --csv`,
        `$ jiraserver issues:delete -a "MyAlias" --issue "theIssueKeyOrId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        issue: Flags.string({
            description: 'The Issue key or id to delete',
            required: true,
            name: 'Issue Key or Id',
        }),
        subtasks: Flags.string({
            description: 'true or false indicating that any subtasks should also be deleted. If the issue has no subtasks this parameter is ignored. If the issue has subtasks and this parameter is missing or false, then the issue will not be deleted and an error will be returned',
            required: false,
            name: 'Delete Subtasks',
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.issues.delete(this.flags.issue);
            response.status = 0;
            response.message = this.getRecordDeletedText('Issue');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}