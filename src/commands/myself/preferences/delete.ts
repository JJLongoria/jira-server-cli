import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";

export default class Get extends BaseCommand {
    static description = 'Removes preference of the currently logged in user.';
    static examples = [
        '$ jiraserver myself:preferences:delete -a "MyAlias" --key "thePreferenceKey" --json',
        '$ jiraserver myself:preferences:delete -a "MyAlias" --key "thePreferenceKey"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        key: Flags.string({
            description: 'The Preference key to delete',
            required: true,
            name: 'Preference key',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.myPreferences.get(this.flags.key);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordDeletedText(this.flags.key + ' Preference');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
