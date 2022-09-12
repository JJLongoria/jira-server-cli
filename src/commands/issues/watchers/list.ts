import { Flags } from '@oclif/core';
import { IssueWatchers, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { IssueWatchersColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns the list of watchers for the issue with the given key. ' + UX.processDocumentation('<doc:IssueWatchers>');
    static examples = [
        '$ jiraserver issues:watchers:list -a "MyAlias" --issue "theIssueKeyOrId" --json',
        '$ jiraserver issues:watchers:list -a "MyAlias" --issue "theIssueKeyOrId" --csv',
        '$ jiraserver issues:watchers:list -a "MyAlias" --issue "theIssueKeyOrId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        issue: Flags.string({
            description: 'The Issue key or id to get watchers',
            required: true,
            name: 'Issue Key or Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueWatchers>> {
        const response = new JiraCLIResponse<IssueWatchers>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.watchers(this.flags.issue).list();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Issue Watchers');
            this.ux.log(response.message);
            this.ux.table<IssueWatchers>([result], IssueWatchersColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
