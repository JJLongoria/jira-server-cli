import { Flags } from '@oclif/core';
import { IssueTypeScheme, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { IssueTypeSchemeColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns a full representation of the issue type scheme that has the given id (must be admin). ' + UX.processDocumentation('<doc:IssueTypeScheme>');
    static examples = [
        '$ jiraserver issues:types:schemes:get -a "MyAlias" --scheme "theIssueTypeSchemeId" --json',
        '$ jiraserver issues:types:schemes:get -a "MyAlias" --scheme "theIssueTypeSchemeId" --csv',
        '$ jiraserver issues:types:schemes:get -a "MyAlias" --scheme "theIssueTypeSchemeId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        scheme: Flags.string({
            description: 'The Issue Type Scheme Id to retrieve',
            required: true,
            name: 'Issue Type Scheme Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueTypeScheme>> {
        const response = new JiraCLIResponse<IssueTypeScheme>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueTypesSchemes.get(this.flags.scheme);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Issue Type Scheme');
            this.ux.log(response.message);
            this.ux.table<IssueTypeScheme>([result], IssueTypeSchemeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
