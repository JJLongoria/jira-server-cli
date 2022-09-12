import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';

export default class Upload extends BaseCommand {
    static description = 'Extracts given zip file to temporary templates folder. If the folder already exists it will replace it\'s content.';
    static examples = [
        '$ jiraserver email:templates:upload -a "MyAlias" --file "path/to/the/zip/file" --json',
        '$ jiraserver email:templates:upload -a "MyAlias" --file "path/to/the/zip/file"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        file: Flags.file({
            description: 'The Zip file with email templates to upload',
            required: true,
            name: 'Zip File',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.emailTemplates.upload(this.flags.file);
            response.result = result;
            response.status = 0;
            response.message = 'Email Templates upload successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
