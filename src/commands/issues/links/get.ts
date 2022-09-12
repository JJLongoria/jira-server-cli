import { Flags } from '@oclif/core';
import { JiraServerConnector, LinkIssue } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { LinkIssueColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns an issue link with the specified id. ' + UX.processDocumentation('<doc:LinkIssue>');
    static examples = [
        '$ jiraserver issues:links:get -a "MyAlias" --link "theLinkId" --json',
        '$ jiraserver issues:links:get -a "MyAlias" --link "theLinkId" --csv',
        '$ jiraserver issues:links:get -a "MyAlias" --link "theLinkId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        link: Flags.string({
            description: 'The Issue Link id to retrieve',
            required: true,
            name: 'Link Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<LinkIssue>> {
        const response = new JiraCLIResponse<LinkIssue>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueLinks.get(this.flags.link);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Issue Link');
            this.ux.log(response.message);
            this.ux.table<LinkIssue>([result], LinkIssueColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
