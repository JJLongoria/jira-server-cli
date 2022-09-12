import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';

export default class Remove extends BaseCommand {
    static description = 'Adds given user to a group. Returns the current state of the group.';
    static examples = [
        '$ jiraserver admin:groups:users:remove -a "MyAlias" --group "theGroupName" --user "theUserName" --json',
        '$ jiraserver admin:groups:users:remove -a "MyAlias" --group "theGroupName" --user "theUserName" --csv',
        '$ jiraserver admin:groups:users:remove -a "MyAlias" --group "theGroupName" --user "theUserName"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        group: Flags.string({
            description: 'The group name to remove the user',
            required: true,
            name: 'Group',
        }),
        user: Flags.string({
            description: 'The user name to remove',
            required: true,
            name: 'User',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.groups.members(this.flags.group).delete(this.flags.user);
            response.status = 0;
            response.message = this.getRecordDeletedText('Group Member');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
