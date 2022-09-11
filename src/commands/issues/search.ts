import { Flags } from "@oclif/core";
import { Issue, JiraServerConnector, Page } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { IssueColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class Search extends BaseCommand {
    static description = 'Performs a search using JQL to get a issue pages. ' + UX.processDocumentation('<doc:Issue>') + '. See https://docs.atlassian.com/software/jira/docs/api/REST/9.2.0/#api/2/search-searchUsingSearchRequest to get more info about parameters';
    static examples = [
        `$ jiraserver issues:search -a "MyAlias" --jql "theJQL" --no-validate -s 20 -l 100 --json`,
        `$ jiraserver issues:search -a "MyAlias" --jql "theJQL" --validate --fields "*all" --all --csv`,
        `$ jiraserver issues:search -a "MyAlias" --jql "theJQL" --fields "summary, status, assignee" -l 100`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        expand: BuildFlags.expand(),
        csv: BuildFlags.csv,
        ...BuildFlags.pagination(),
        jql: Flags.string({
            description: 'A JQL query string',
            required: true,
            name: 'JQL',
        }),
        fields: BuildFlags.array({
            description: 'The list of fields to return for each issue. By default, all navigable fields are returned.',
            required: false,
            name: 'Fields',
        }),
        validate: Flags.boolean({
            description: 'Whether to validate the JQL query.',
            required: false,
            default: true,
            allowNo: true,
            name: 'Validate',
        }),
    };
    async run(): Promise<JiraCLIResponse<Page<Issue>>> {
        const response = new JiraCLIResponse<Page<Issue>>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Issue> = new Page();
            if (this.flags.all) {
                let tmp = await connector.issues.search({
                    jql: this.flags.jql,
                    fields: this.flags.fields,
                    validateQuery: this.flags.validate,
                    maxResults: this.allPageOptions?.maxResults,
                    startAt: this.allPageOptions?.startAt,
                    expand: this.allPageOptions?.expand,
                });
                result.values.push(...tmp.values);
                result.isLast = true;
                result.startAt = tmp.startAt;
                while (!tmp.isLast) {
                    tmp = await connector.issues.search({
                        jql: this.flags.jql,
                        fields: this.flags.fields,
                        validateQuery: this.flags.validate,
                        startAt: tmp.nextPageStart,
                        maxResults: 100,
                        expand: this.allPageOptions?.expand,
                    });
                    result.values.push(...tmp.values);
                }
                result.maxResults = result.values.length;
            } else {
                result = await connector.issues.search({
                    jql: this.flags.jql,
                    fields: this.flags.fields,
                    validateQuery: this.flags.validate,
                    maxResults: this.pageOptions?.maxResults,
                    startAt: this.pageOptions?.startAt,
                    expand: this.allPageOptions?.expand,
                });
            }
            response.result = result
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Issue');
            this.ux.log(response.message);
            this.ux.table<Issue>(result.values, IssueColumns, {
                csv: this.flags.csv,

            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}