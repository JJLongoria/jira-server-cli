import { Flags } from '@oclif/core';
import { Comment, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { CommentColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns a single comment. ' + UX.processDocumentation('<doc:Comment>');
    static examples = [
        '$ jiraserver issues:comments:get -a "MyAlias" --issue "theIssueKeyOrId" --comment "theCommentId" --json',
        '$ jiraserver issues:comments:get -a "MyAlias" --issue "theIssueKeyOrId" --comment "theCommentId" --expand "renderedBody" --csv',
        '$ jiraserver issues:comments:get -a "MyAlias" --issue "theIssueKeyOrId" --comment "theCommentId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        expand: BuildFlags.expand('Optional flags: renderedBody (provides body rendered in HTML)'),
        issue: Flags.string({
            description: 'The Issue key or id to retrieve comment',
            required: true,
            name: 'Issue Key or Id',
        }),
        comment: Flags.string({
            description: 'The Comment Id to retrieve',
            required: true,
            name: 'Comment Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<Comment>> {
        const response = new JiraCLIResponse<Comment>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.comments(this.flags.issue).get(this.flags.comment, this.flags.expand);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Comment');
            this.ux.log(response.message);
            this.ux.table<Comment>([result], CommentColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
