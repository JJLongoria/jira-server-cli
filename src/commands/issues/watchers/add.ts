import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';

export default class Add extends BaseCommand {
    static description = 'Adds a user to an issue\'s watcher list.';
    static examples = [
        '$ jiraserver issues:watchers:add -a "MyAlias" --issue "theIssueKeyOrId" --user "theUsername" --json',
        '$ jiraserver issues:watchers:add -a "MyAlias" --issue "theIssueKeyOrId" --user "theUsername" --csv',
        '$ jiraserver issues:watchers:add -a "MyAlias" --issue "theIssueKeyOrId" --user "theUsername"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        issue: Flags.string({
            description: 'The Issue key or id to watch',
            required: true,
            name: 'Issue Key or Id',
        }),
        user: Flags.string({
            description: 'The Username to watch the issue',
            required: true,
            name: 'User',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.issues.watchers(this.flags.issue).add(this.flags.user);
            response.status = 0;
            response.message = 'Watch Issue successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
