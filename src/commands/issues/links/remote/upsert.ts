import { Flags } from '@oclif/core';
import { IssueRemoteLink, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { IssueRemoteLinkColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class Upsert extends BaseCommand {
    static description = 'Creates or updates a remote issue link from a JSON representation. If a globalId is provided and a remote issue link exists with that globalId, the remote issue link is updated. Otherwise, the remote issue link is created. ' + UX.processDocumentation('<doc:IssueRemoteLink>');
    static examples = [
        '$ jiraserver issues:links:remote:upsert -a "MyAlias" --issue "theIssueKeyOrId" --data "{\'globalId\':\'system=http://www.mycompany.com/support&id=1\',\'application\':{\'type\':\'com.acme.tracker\',\'name\':\'My Acme Tracker\'},\'relationship\':\'causes\',\'object\':{\'url\':\'http://www.mycompany.com/support?id=1\',\'title\':\'TSTSUP-111\',\'summary\':\'Crazy customer support issue\',\'icon\':{\'url16x16\':\'http://www.mycompany.com/support/ticket.png\',\'title\':\'Support Ticket\'},\'status\':{\'resolved\':true,\'icon\':{\'url16x16\':\'http://www.mycompany.com/support/resolved.png\',\'title\':\'Case Closed\',\'link\':\'http://www.mycompany.com/support?id=1&details=closed\'}}}}" --json',
        '$ jiraserver issues:links:remote:upsert -a "MyAlias" --issue "theIssueKeyOrId" --file "path/to/the/json/data/file" --csv',
        '$ jiraserver issues:links:remote:upsert -a "MyAlias" --issue "theIssueKeyOrId" --file "path/to/the/json/data/file"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        data: BuildFlags.input.jsonData('<doc:IssueRemoteLink>'),
        file: BuildFlags.input.jsonFile('<doc:IssueRemoteLink>'),
        issue: Flags.string({
            description: 'The Issue key or id to upsert remote link',
            required: true,
            name: 'Issue Key or Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueRemoteLink>> {
        const response = new JiraCLIResponse<IssueRemoteLink>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.remoteLinks(this.flags.issue).upsert(this.getJSONInputData());
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Issue Remote Link');
            this.ux.log(response.message);
            this.ux.table<IssueRemoteLink>([result], IssueRemoteLinkColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
