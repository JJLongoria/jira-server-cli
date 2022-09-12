import { Flags } from '@oclif/core';
import { IssueWorklog, JiraServerConnector, Page } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { IssueWorklogColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns all work logs for an issue. Returned in a page format. ' + UX.processDocumentation('<doc:IssueWorklog>');
    static examples = [
        '$ jiraserver issues:worklogs:list -a "MyAlias" --issue "theIssueKeyOrId" -s 20 -l 100 --json',
        '$ jiraserver issues:worklogs:list -a "MyAlias" --issue "theIssueKeyOrId" --all --csv',
        '$ jiraserver issues:worklogs:list -a "MyAlias" --issue "theIssueKeyOrId" -l 100',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        ...BuildFlags.pagination(),
        issue: Flags.string({
            description: 'The Issue key or id to get worklogs',
            required: true,
            name: 'Issue Key or Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<Page<IssueWorklog>>> {
        const response = new JiraCLIResponse<Page<IssueWorklog>>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<IssueWorklog> = new Page();
            if (this.flags.all) {
                let tmp = await connector.issues.worklogs(this.flags.issue).list(this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLast = true;
                result.startAt = tmp.startAt;
                while (!tmp.isLast) {
                    tmp = await connector.issues.worklogs(this.flags.issue).list({
                        startAt: tmp.nextPageStart,
                        maxResults: 100,
                    });
                    result.values.push(...tmp.values);
                }

                result.maxResults = result.values.length;
            } else {
                result = await connector.issues.worklogs(this.flags.issue).list(this.pageOptions);
            }

            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Issue Worklogs');
            this.ux.log(response.message);
            this.ux.table<IssueWorklog>(result.values, IssueWorklogColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,

            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
