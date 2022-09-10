import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { FileChecker, FileWriter, PathUtils } from "../../../libs/fileSystem";

export default class Download extends BaseCommand {
    static description = 'Creates a zip file containing email templates at local home and returns the file.';
    static examples = [
        `$ jiraserver email:templates:upload -a "MyAlias" --output-folder "path/to/the/output/folder" --json`,
        `$ jiraserver email:templates:upload -a "MyAlias" --raw --json`,
        `$ jiraserver email:templates:upload -a "MyAlias" --output-folder "path/to/the/output/folder"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        'output-folder': BuildFlags.output.folder('', false, ['raw']),
        raw: Flags.boolean({
            description: '',
            required: false,
            name: 'Raw',
            exclusive: ['output-folder']
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.emailTemplates.download();
            response.result = result
            response.status = 0;
            if (this.flags.raw) {
                this.ux.log(result);
                response.message = 'Email Templates download successfully';
            } else {
                const output = PathUtils.getAbsolutePath(this.flags['output-folder']);
                if (!FileChecker.isExists(output)) {
                    FileWriter.createFolderSync(output);
                }
                const fileName = output + '/' + this.flags.alias + '_jira_emailTemplates.zip'
                response.message = 'Email Templates saved on: ' + fileName;
                this.ux.log(response.message);
            }
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}