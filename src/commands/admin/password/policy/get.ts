import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';

export default class Get extends BaseCommand {
    static description = 'Returns the list of requirements for the current password policy. For example, "The password must have at least 10 characters.", "The password must not be similar to the user\'s name or email address.", etc.';
    static examples = [
        '$ jiraserver admin:password:policy:get -a "MyAlias" --json',
        '$ jiraserver admin:password:policy:get -a "MyAlias" --csv',
        '$ jiraserver admin:password:policy:get -a "MyAlias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
    };

    async run(): Promise<JiraCLIResponse<string[]>> {
        const response = new JiraCLIResponse<string[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.password.policy().get();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Password Policy');
            this.ux.log(response.message);
            const columns: any = [{
                header: 'Policy',
            }];
            this.ux.table<string>(result, columns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
