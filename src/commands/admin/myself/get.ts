import { JiraServerConnector, User } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { UserColumns } from '../../../libs/core/tables';

export default class Get extends BaseCommand {
    static description = 'Returns currently logged user. This resource cannot be accessed anonymously';
    static examples = [
        '$ jiraserver admin:myself:get -a "MyAlias" --json',
        '$ jiraserver admin:myself:get -a "MyAlias" --csv',
        '$ jiraserver admin:myself:get -a "MyAlias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
    };

    async run(): Promise<JiraCLIResponse<User>> {
        const response = new JiraCLIResponse<User>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.mySelf.get();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('User');
            this.ux.log(response.message);
            this.ux.table<User>([result], UserColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
