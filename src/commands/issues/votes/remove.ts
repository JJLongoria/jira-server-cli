import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';

export default class Unvote extends BaseCommand {
    static description = 'Remove your vote from an issue. (i.e. "unvote").';
    static examples = [
        '$ jiraserver issues:votes:remove -a "MyAlias" --issue "theIssueKeyOrId" --json',
        '$ jiraserver issues:votes:remove -a "MyAlias" --issue "theIssueKeyOrId" --csv',
        '$ jiraserver issues:votes:remove -a "MyAlias" --issue "theIssueKeyOrId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        issue: Flags.string({
            description: 'The Issue key or id to "unvote"',
            required: true,
            name: 'Issue Key or Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.votes(this.flags.issue).remove();
            response.status = 0;
            response.message = 'Issue unvoted successffully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
