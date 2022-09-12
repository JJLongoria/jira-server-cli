import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';

export default class Set extends BaseCommand {
    static description = 'Sets preference of the currently logged in user.';
    static examples = [
        '$ jiraserver myself:preferences:get -a "MyAlias" --key "thePreferenceKey" --value "theValue" --json',
        '$ jiraserver myself:preferences:get -a "MyAlias" --key "thePreferenceKey" --value "1234"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        key: Flags.string({
            description: 'The Preference key to retrieve',
            required: true,
            name: 'Preference key',
        }),
        value: Flags.string({
            description: 'The Preference value',
            required: true,
            name: 'Preference Value',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.myPreferences.set(this.flags.key, this.flags.value);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordUpdatedText(this.flags.key + ' Preference');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
