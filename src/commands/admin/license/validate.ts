import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { FileChecker, FileReader, PathUtils } from '../../../libs/fileSystem';

export default class Validate extends BaseCommand {
    static description = 'Simple validation services for a Jira license. Typically used by the setup phase of the Jira application.';
    static examples = [
        '$ jiraserver admin:license:validate -a "MyAlias" --content "License Content to validate" --json',
        '$ jiraserver admin:license:validate -a "MyAlias" --file "path/to/license/file" --csv',
        '$ jiraserver admin:license:validate -a "MyAlias" --content "License Content to validate"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        content: Flags.string({
            description: 'The license content to validate',
            required: false,
            name: 'Content',
            exclusive: ['file'],
        }),
        file: Flags.file({
            description: 'The file with license to validate',
            required: true,
            name: 'File',
            exclusive: ['content'],
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            if (this.flags.file) {
                const absolutePath = PathUtils.getAbsolutePath(this.flags.file);
                if (!FileChecker.isExists(absolutePath)) {
                    throw new Error('The file path ' + absolutePath + ' does not exists.');
                }
            }

            await connector.licenseValidator.validate(this.flags.content || FileReader.readFileSync(this.flags.file));
            response.status = 0;
            response.message = 'License Validated Successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
