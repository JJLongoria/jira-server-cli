import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../libs/core/jiraResponse';

export default class Notify extends BaseCommand {
    static description = 'Sends a notification (email) to the list or recipients defined in the request. ';
    static examples = [
        '$ jiraserver issues:notify -a "MyAlias" --issue "theIssueKeyOrId" --data "{\'subject\':\'Duis eu justo eget augue iaculis fermentum.\',\'textBody\':\'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget venenatis elit. Duis eu justo eget augue iaculis fermentum. Sed semper quam laoreet nisi egestas at posuere augue semper.\',\'htmlBody\':\'Lorem ipsum <strong>dolor</strong> sit amet, consectetur adipiscing elit. Pellentesque eget venenatis elit. Duis eu justo eget augue iaculis fermentum. Sed semper quam laoreet nisi egestas at posuere augue semper.\',\'to\':{\'reporter\':false,\'assignee\':false,\'watchers\':true,\'voters\':true,\'users\':[{\'name\':\'fred\',\'active\':false}],\'groups\':[{\'name\':\'notification-group\',\'self\':\'http://www.example.com/jira/rest/api/2/group?groupname=notification-group\'}]},\'restrict\':{\'groups\':[{\'name\':\'notification-group\',\'self\':\'http://www.example.com/jira/rest/api/2/group?groupname=notification-group\'}],\'permissions\':[{\'id\':\'10\',\'key\':\'BROWSE\'}]}}" --no-notify --json',
        '$ jiraserver issues:notify -a "MyAlias" --issue "theIssueKeyOrId" --file "path/to/the/json/data/file" --csv',
        '$ jiraserver issues:notify -a "MyAlias" --issue "theIssueKeyOrId" --file "path/to/the/json/data/file"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:IssueNotification>'),
        file: BuildFlags.input.jsonFile('<doc:IssueNotification>'),
        issue: Flags.string({
            description: 'The Issue key or id to notify',
            required: true,
            name: 'Issue Key or Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.notify(this.flags.issue, this.getJSONInputData());
            response.status = 0;
            response.message = 'Issue Notified successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
