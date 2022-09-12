import { Configuration, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { ConfigurationColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns the information if the optional features in Jira are enabled or disabled. If the time tracking is enabled, it also returns the detailed information about time tracking configuration. ' + UX.processDocumentation('<doc:Configuration>');
    static examples = [
        '$ jiraserver admin:configuration:get -a "MyAlias" --json',
        '$ jiraserver admin:configuration:get -a "MyAlias" --csv',
        '$ jiraserver admin:configuration:get -a "MyAlias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
    };

    async run(): Promise<JiraCLIResponse<Configuration>> {
        const response = new JiraCLIResponse<Configuration>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.configuration.get();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Configuration');
            this.ux.log(response.message);
            this.ux.table<Configuration>([result], ConfigurationColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
