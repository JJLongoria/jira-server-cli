import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';

export default class Get extends BaseCommand {
    static description = 'Returns preference of the currently logged in user. The value is returned exactly as it is.';
    static examples = [
        '$ jiraserver admin:myself:preferences:get -a "MyAlias" --key "thePreferenceKey" --json',
        '$ jiraserver admin:myself:preferences:get -a "MyAlias" --key "thePreferenceKey"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        key: Flags.string({
            description: 'The Preference key to retrieve',
            required: true,
            name: 'Preference key',
        }),
    };

    async run(): Promise<JiraCLIResponse<string>> {
        const response = new JiraCLIResponse<string>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.myPreferences.get(this.flags.key);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText(this.flags.key + ' Preference');
            this.ux.log(result);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
