import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';

export default class Update extends BaseCommand {
    static description = 'Modify logged user password.';
    static examples = [
        '$ jiraserver admin:myself:password:update -a "MyAlias" --old "theCurrentPassword" --new "theNewPassword" --json',
        '$ jiraserver admin:myself:password:update -a "MyAlias" --interactive',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        interactive: BuildFlags.interactive(['old', 'new']),
        old: Flags.string({
            description: 'The Old (Current) password',
            required: false,
            name: 'Old',
            exclusive: ['interactive'],
        }),
        new: Flags.string({
            description: 'The New Passoword',
            required: false,
            name: 'New',
            exclusive: ['interactive'],
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let oldPass;
            let newPass;
            if (this.flags.interactive) {
                oldPass = await this.ux.prompt('Insert Old (Current) Passowrd', {
                    required: true,
                    type: 'hide',
                });
                newPass = await this.ux.prompt('Insert New Passowrd', {
                    required: true,
                    type: 'hide',
                });
            } else {
                oldPass = this.flags.old;
                newPass = this.flags.new;
            }

            await connector.mySelf.changePassoword(oldPass, newPass);
            response.status = 0;
            response.message = this.getRecordUpdatedText('User Password');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
