import { Flags } from '@oclif/core';
import { Comment, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { CommentColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Update extends BaseCommand {
    static description = 'Updates an existing comment using its JSON representation. ' + UX.processDocumentation('<doc:Comment>');
    static examples = [
        '$ jiraserver issues:comments:update -a "MyAlias" --issue "theIssueKeyOrId" --comment "theCommentId" --data "{\'body\':\'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget venenatis elit. Duis eu justo eget augue iaculis fermentum. Sed semper quam laoreet nisi egestas at posuere augue semper.\',\'visibility\':{\'type\':\'role\',\'value\':\'Administrators\'}}" --json',
        '$ jiraserver issues:comments:update -a "MyAlias" --issue "theIssueKeyOrId" --comment "theCommentId" --file "path/to/the/json/data/file" --csv',
        '$ jiraserver issues:comments:update -a "MyAlias" --issue "theIssueKeyOrId" --comment "theCommentId" --body "Lorem ipsum dolor sit amet, consectetur adipiscing elit" --type group --value "myGroup"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        expand: BuildFlags.expand('Optional flags: renderedBody (provides body rendered in HTML)'),
        data: BuildFlags.input.jsonData('<doc:CommentInput>', false, ['body', 'type', 'value']),
        file: BuildFlags.input.jsonFile('<doc:CommentInput>', false, ['body', 'type', 'value']),
        issue: Flags.string({
            description: 'The Issue key or id to update comment',
            required: true,
            name: 'Issue Key or Id',
        }),
        comment: Flags.string({
            description: 'The Comment Id to update',
            required: true,
            name: 'Comment Id',
        }),
        body: Flags.string({
            description: 'The comment body',
            required: false,
            name: 'Comment Body',
            exclusive: ['data', 'file'],
            dependsOn: ['value', 'type'],
        }),
        type: Flags.string({
            description: 'The visibility type',
            required: false,
            name: 'Visibility Type',
            options: ['role', 'group'],
            type: 'option',
            exclusive: ['data', 'file'],
            dependsOn: ['body', 'value'],
        }),
        value: Flags.string({
            description: 'The visibility value',
            required: false,
            name: 'Visibility Value',
            exclusive: ['data', 'file'],
            dependsOn: ['body', 'type'],
        }),
    };

    async run(): Promise<JiraCLIResponse<Comment>> {
        const response = new JiraCLIResponse<Comment>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await (this.hasInputData() ? connector.issues.comments(this.flags.issue).update(this.flags.comment, this.getJSONInputData(), this.flags.expand) : connector.issues.comments(this.flags.issue).update(this.flags.comment, {
                body: this.flags.body,
                visibility: {
                    type: this.flags.type,
                    value: this.flags.value,
                },
            }, this.flags.expand));
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Comment');
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
