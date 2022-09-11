import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";

export default class Restore extends BaseCommand {
    static description = 'Restores an archived issue';
    static examples = [
        `$ jiraserver issues:restore -a "MyAlias" --issue "theIssueKeyOrId" --no-notify --json`,
        `$ jiraserver issues:restore -a "MyAlias" --issue "theIssueKeyOrId" --csv`,
        `$ jiraserver issues:restore -a "MyAlias" --issue "theIssueKeyOrId" --notify`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        issue: BuildFlags.array({
            description: 'The Issue key or id to restore',
            required: true,
            name: 'Issue Key or Id',
            exclusive: ['issues']
        }),
        notify: Flags.boolean({
            description: 'Send the email with notification that the issue was updated to users that watch it. Admin or project admin permissions are required to disable the notification',
            required: false,
            default: true,
            name: 'Notify Users',
            allowNo: true,
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.restore(this.flags.issue, this.flags.notify);
            response.status = 0;
            response.message = 'Issue Restored successfully'
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}