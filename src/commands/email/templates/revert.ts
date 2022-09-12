import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';

export default class Revert extends BaseCommand {
    static description = 'Replaces the current email templates pack with default templates, which are copied over from Jira binaries.';
    static examples = [
        '$ jiraserver email:templates:revert -a "MyAlias" --json',
        '$ jiraserver email:templates:revert -a "MyAlias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.emailTemplates.revert();
            response.result = result;
            response.status = 0;
            response.message = 'Email Templates reverted successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
