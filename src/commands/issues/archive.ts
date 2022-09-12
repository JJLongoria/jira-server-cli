import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../libs/core/jiraResponse';

export default class Archive extends BaseCommand {
    static description = 'Archives an issue or archive a list of issues';
    static examples = [
        '$ jiraserver issues:archive -a "MyAlias" --issue "theIssueKeyOrId" --no-notify --json',
        '$ jiraserver issues:archive -a "MyAlias" --issue "theIssueKeyOrId1, theIssueKeyOrId2, theIssueKeyOrId3" --csv',
        '$ jiraserver issues:archive -a "MyAlias" --issue "theIssueKeyOrId" --notify',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        issue: BuildFlags.array({
            description: 'The Issue key or id to archive (or a Comma Separated Values of issues to archive in bulk)',
            required: true,
            name: 'Issue Key or Id',
            exclusive: ['issues'],
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
            const result = this.flags.issues && this.flags.issue.length > 1 ? await connector.issues.archiveBulk(this.flags.issue, this.flags.notify) : await connector.issues.archive(this.flags.issue[0], this.flags.notify);
            response.status = 0;
            response.message = 'Issue(s) Archived successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
