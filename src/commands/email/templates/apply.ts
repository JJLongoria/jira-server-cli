import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';

export default class Apply extends BaseCommand {
    static description = 'Replaces the current email templates pack with previously uploaded one, if exists.';
    static examples = [
        '$ jiraserver email:templates:apply -a "MyAlias" --json',
        '$ jiraserver email:templates:apply -a "MyAlias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.emailTemplates.apply();
            response.result = result;
            response.status = 0;
            response.message = 'Email Templates applied successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
