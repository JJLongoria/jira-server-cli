import { Flags } from '@oclif/core';
import { IssueRemoteLink, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { IssueRemoteLinkColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'List all remote links for an issue. ' + UX.processDocumentation('<doc:IssueRemoteLink>');
    static examples = [
        '$ jiraserver issues:links:remote:list -a "MyAlias" --issue "theIssueKeyOrId" --json',
        '$ jiraserver issues:links:remote:list -a "MyAlias" --issue "theIssueKeyOrId" --link "theLinkGlobalId" --csv',
        '$ jiraserver issues:links:remote:list -a "MyAlias" --issue "theIssueKeyOrId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        issue: Flags.string({
            description: 'The Issue key or id to retrieve remote links',
            required: true,
            name: 'Issue Key or Id',
        }),
        link: Flags.string({
            description: 'The Link Global Id to retrieve the specified link',
            required: false,
            name: 'Link Global Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueRemoteLink[]>> {
        const response = new JiraCLIResponse<IssueRemoteLink[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.remoteLinks(this.flags.issue).list(this.flags.link);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.length, 'Issue Remote Link');
            this.ux.log(response.message);
            this.ux.table<IssueRemoteLink>(result, IssueRemoteLinkColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
