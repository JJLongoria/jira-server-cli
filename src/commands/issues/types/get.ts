import { IssueType, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { IssueTypeColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns a full representation of the issue type that has the given id. ' + UX.processDocumentation('<doc:IssueType>');
    static examples = [
        '$ jiraserver issues:types:get -a "MyAlias" --type "theIssueTypeId" --json',
        '$ jiraserver issues:types:get -a "MyAlias" --type "theIssueTypeId" --csv',
        '$ jiraserver issues:types:get -a "MyAlias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        type: BuildFlags.array({
            description: 'The Issue Type Id to retrieve',
            required: true,
            name: 'Issue Type Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueType>> {
        const response = new JiraCLIResponse<IssueType>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueTypes.get(this.flags.type);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Issue Type');
            this.ux.log(response.message);
            this.ux.table<IssueType>([result], IssueTypeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
