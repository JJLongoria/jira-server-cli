import { Flags } from "@oclif/core";
import { timeStamp } from "console";
import { Comment, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { CommentColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Add extends BaseCommand {
    static description = 'Adds a new comment to an issue. ' + UX.processDocumentation('<doc:Comment>');
    static examples = [
        `$ jiraserver issues:comments:add -a "MyAlias" --issue "theIssueKeyOrId" --data "{'body':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget venenatis elit. Duis eu justo eget augue iaculis fermentum. Sed semper quam laoreet nisi egestas at posuere augue semper.','visibility':{'type':'role','value':'Administrators'}}" --json`,
        `$ jiraserver issues:comments:add -a "MyAlias" --issue "theIssueKeyOrId" --file "path/to/the/json/data/file" --csv`,
        `$ jiraserver issues:comments:add -a "MyAlias" --issue "theIssueKeyOrId" --body "Lorem ipsum dolor sit amet, consectetur adipiscing elit" --type group --value "myGroup"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        data: BuildFlags.input.jsonData('<doc:CommentInput>', false, ['body', 'type', 'value']),
        file: BuildFlags.input.jsonFile('<doc:CommentInput>', false, ['body', 'type', 'value']),
        issue: Flags.string({
            description: 'The Issue key or id to add new comment',
            required: true,
            name: 'Issue Key or Id',
        }),
        body: Flags.string({
            description: 'Create issues in bulk, this expect and array of IssueInput as data (instead a single IssueInput). With this options, return an IssueLinks response (instead single issue link)' + UX.processDocumentation('<doc:IssueLinks>'),
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
            type: "option",
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
            let result;
            if (this.hasInputData()) {
                result = await connector.issues.comments(this.flags.issue).create(this.getJSONInputData());
            } else {
                result = await connector.issues.comments(this.flags.issue).create({
                    body: this.flags.body,
                    visibility: {
                        type: this.flags.type,
                        value: this.flags.value,
                    }
                });
            }
            response.result = result
            response.status = 0;
            response.message = this.getRecordCreatedText('Issue(s)');
            this.ux.log(response.message);
            this.ux.table<Comment>([result], CommentColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}