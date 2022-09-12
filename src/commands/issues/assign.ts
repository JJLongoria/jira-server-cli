import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../libs/core/jiraResponse';

export default class Assign extends BaseCommand {
    static description = 'Assigns an issue to a user. You can use this resource to assign issues when the user submitting the request has the assign permission but not the edit issue permission. If the name is "-1" automatic assignee is used.';
    static examples = [
        '$ jiraserver issues:assign -a "MyAlias" --issue "theIssueKeyOrId" --user "-1" --json',
        '$ jiraserver issues:assign -a "MyAlias" --issue "theIssueKeyOrId" --user "theUserName" --csv',
        '$ jiraserver issues:assign -a "MyAlias" --issue "theIssueKeyOrId" --remove',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        issue: Flags.string({
            description: 'The Issue key or id to assign',
            required: true,
            name: 'Issue Key or Id',
            exclusive: ['issues'],
        }),
        user: Flags.string({
            description: 'The user to assign. -1 to automatic assignment.',
            required: false,
            name: 'User',
            exclusive: ['remove'],
        }),
        remove: Flags.boolean({
            description: 'remove the assignee.',
            required: false,
            name: 'User',
            exclusive: ['user'],
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.issues.assign(this.flags.issue, this.flags.remove ? undefined : this.flags.user);
            response.status = 0;
            response.message = 'Issue Assigned successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
