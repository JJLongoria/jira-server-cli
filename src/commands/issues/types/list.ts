import { IssueType, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { IssueTypeColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns a list of all issue types visible to the user. ' + UX.processDocumentation('<doc:IssueType>');
    static examples = [
        '$ jiraserver issues:types:list -a "MyAlias" --json',
        '$ jiraserver issues:types:list -a "MyAlias" --csv',
        '$ jiraserver issues:types:list -a "MyAlias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
    };

    async run(): Promise<JiraCLIResponse<IssueType[]>> {
        const response = new JiraCLIResponse<IssueType[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueTypes.list();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.length, 'Issue Type');
            this.ux.log(response.message);
            this.ux.table<IssueType>(result, IssueTypeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
