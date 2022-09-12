import { Flags } from '@oclif/core';
import { Group, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { GroupColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class Add extends BaseCommand {
    static description = 'Adds given user to a group. Returns the current state of the group. ' + UX.processDocumentation('<doc:Group>');
    static examples = [
        '$ jiraserver admin:groups:users:add -a "MyAlias" --group "theGroupName" --user "theUserName" --json',
        '$ jiraserver admin:groups:users:add -a "MyAlias" --group "theGroupName" --user "theUserName" --csv',
        '$ jiraserver admin:groups:users:add -a "MyAlias" --group "theGroupName" --user "theUserName"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        group: Flags.string({
            description: 'The group name to add the user',
            required: true,
            name: 'Group',
        }),
        user: Flags.string({
            description: 'The user name to add',
            required: true,
            name: 'User',
        }),
    };

    async run(): Promise<JiraCLIResponse<Group>> {
        const response = new JiraCLIResponse<Group>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.groups.members(this.flags.group).create(this.flags.user);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Group Member');
            this.ux.log(response.message);
            this.ux.table<Group>([result], GroupColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
