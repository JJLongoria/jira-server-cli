import { IssueType, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { IssueTypeColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns a list of all alternative issue types for the given issue type id. The list will contain these issues types, to which issues assigned to the given issue type can be migrated. The suitable alternatives are issue types which are assigned to the same workflow, the same field configuration and the same screen scheme. ' + UX.processDocumentation('<doc:IssueType>');
    static examples = [
        '$ jiraserver issues:types:alternatives:list -a "MyAlias" --type "theIssueTypeId" --json',
        '$ jiraserver issues:types:alternatives:list -a "MyAlias" --type "theIssueTypeId" --csv',
        '$ jiraserver issues:types:alternatives:list -a "MyAlias" --type "theIssueTypeId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        type: BuildFlags.array({
            description: 'The Issue Type Id to get alternatives',
            required: true,
            name: 'Issue Type Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueType[]>> {
        const response = new JiraCLIResponse<IssueType[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueTypes.alternatives(this.flags.type).list();
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
