import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';

export default class Get extends BaseCommand {
    static description = 'Deletes the specified issue type scheme. Any projects associated with this IssueTypeScheme will be automatically associated with the global default IssueTypeScheme. (Admin required).';
    static examples = [
        '$ jiraserver issues:types:schemes:delete -a "MyAlias" --scheme "theIssueTypeSchemeId" --json',
        '$ jiraserver issues:types:schemes:delete -a "MyAlias" --scheme "theIssueTypeSchemeId" --csv',
        '$ jiraserver issues:types:schemes:delete -a "MyAlias" --scheme "theIssueTypeSchemeId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        scheme: Flags.string({
            description: 'The Issue Type Scheme Id to delete',
            required: true,
            name: 'Issue Type Scheme Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.issueTypesSchemes.delete(this.flags.scheme);
            response.status = 0;
            response.message = this.getRecordDeletedText('Issue Type Scheme');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
