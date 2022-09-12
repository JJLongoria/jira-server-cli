import { IssueTypeScheme, IssueTypeSchemeList, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { IssueTypeSchemeColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns a list of all issue type schemes visible to the user (must be admin). ' + UX.processDocumentation('<doc:IssueTypeSchemeList>');
    static examples = [
        '$ jiraserver issues:types:schemes:list -a "MyAlias" --json',
        '$ jiraserver issues:types:schemes:list -a "MyAlias" --expand "schemes.issueTypes" --json',
        '$ jiraserver issues:types:schemes:list -a "MyAlias" --expand "schemes.defaultIssueType" --csv',
        '$ jiraserver issues:types:schemes:list -a "MyAlias" --expand "schemes.issueTypes,schemes.defaultIssueType"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        expand: BuildFlags.expand(),
        csv: BuildFlags.csv,
    };

    async run(): Promise<JiraCLIResponse<IssueTypeSchemeList>> {
        const response = new JiraCLIResponse<IssueTypeSchemeList>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueTypesSchemes.list(this.flags.expand);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.schemes.length, 'Issue Type Scheme');
            this.ux.log(response.message);
            this.ux.table<IssueTypeScheme>(result.schemes, IssueTypeSchemeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
