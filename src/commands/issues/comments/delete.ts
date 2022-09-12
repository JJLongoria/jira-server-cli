import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';

export default class Delete extends BaseCommand {
    static description = 'Deletes an existing comment. ';
    static examples = [
        '$ jiraserver issues:comments:delete -a "MyAlias" --issue "theIssueKeyOrId" --comment "theCommentId" --json',
        '$ jiraserver issues:comments:delete -a "MyAlias" --issue "theIssueKeyOrId" --comment "theCommentId" --csv',
        '$ jiraserver issues:comments:delete -a "MyAlias" --issue "theIssueKeyOrId" --comment "theCommentId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        issue: Flags.string({
            description: 'The Issue key or id to delete comment',
            required: true,
            name: 'Issue Key or Id',
        }),
        comment: Flags.string({
            description: 'The Comment Id to delete',
            required: true,
            name: 'Comment Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.issues.comments(this.flags.issue).delete(this.flags.comment);
            response.status = 0;
            response.message = this.getRecordDeletedText('Comment');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
