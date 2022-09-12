import { Flags } from '@oclif/core';
import { JiraServerConnector, User } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { UserColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Update extends BaseCommand {
    static description = 'Modify currently logged user. The "value" fields present will override the existing value. Fields skipped in request will not be changed. Only email and display name can be change that way. ' + UX.processDocumentation('<doc:User>');
    static examples = [
        '$ jiraserver myself:update -a "MyAlias" --name "TheNewDisplayName" --json',
        '$ jiraserver myself:update -a "MyAlias" --email "theNewEmail@email.com" --csv',
        '$ jiraserver myself:update -a "MyAlias" --name "TheNewDisplayName" --email "theNewEmail@email.com"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        name: Flags.string({
            description: 'The Display user name',
            required: false,
            name: 'Name',
        }),
        email: Flags.string({
            description: 'The user email',
            required: false,
            name: 'Email',
        }),
    };

    async run(): Promise<JiraCLIResponse<User>> {
        const response = new JiraCLIResponse<User>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.mySelf.update(this.flags.name, this.flags.email);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordUpdatedText('User');
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
