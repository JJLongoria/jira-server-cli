import { Flags } from "@oclif/core";
import { Comment, JiraServerConnector, Page } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { CommentColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Returns all comments for an issue. Results can be ordered by the "created" field which means the date a comment was added. Results are paginated' + UX.processDocumentation('<doc:Comment>');
    static examples = [
        `$ jiraserver issues:comments:list -a "MyAlias" --issue "theIssueKeyOrId" -s 50 --json`,
        `$ jiraserver issues:comments:list -a "MyAlias" --issue "theIssueKeyOrId" -s 25 -l 50 --csv`,
        `$ jiraserver issues:comments:list -a "MyAlias" --issue "theIssueKeyOrId" --all`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        ...BuildFlags.pagination(true, true),
        issue: Flags.string({
            description: 'The Issue key or id to retrieve comments',
            required: true,
            name: 'Issue Key or Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<Page<Comment>>> {
        const response = new JiraCLIResponse<Page<Comment>>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Comment> = new Page();
            if (this.flags.all) {
                let tmp = await connector.issues.comments(this.flags.issue).list(this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLast = true;
                result.startAt = tmp.startAt;
                while (!tmp.isLast) {
                    tmp = await connector.issues.comments(this.flags.issue).list({
                        startAt: tmp.nextPageStart,
                        maxResults: 100,
                        expand: this.flags.expand,
                        orderBy: this.flags.order,
                    });
                    result.values.push(...tmp.values);
                }
                result.maxResults = result.values.length;
            } else {
                result = await connector.issues.comments(this.flags.issue).list(this.pageOptions);
            }
            response.result = result
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Comment');
            this.ux.log(response.message);
            this.ux.table<Comment>([result.values], CommentColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}