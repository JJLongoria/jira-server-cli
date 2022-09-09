import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { FileChecker, PathUtils } from "../../libs/fileSystem";

export default class Upload extends BaseCommand {
    static description = 'Upload new system avatar. This process include all steps to upload new avatar, that is, upload the file, and crop the avatar.';
    static examples = [
        `$ jiraserver avatars:upload -a "MyAlias" --type "avatarType" --json`,
        `$ jiraserver avatars:upload -a "MyAlias" --type "avatarType" --csv`,
        `$ jiraserver avatars:upload -a "MyAlias" --type "avatarType" `,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        type: Flags.string({
            description: 'The Avatar type to upload',
            required: true,
            name: 'Avatar Type'
        }),
        filename: Flags.file({
            description: 'The image\'s filename to upload',
            required: true,
            name: 'If Match'
        }),
        size: Flags.integer({
            description: 'Size of file',
            required: true,
            name: 'Size',
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const absolutePath = PathUtils.getAbsolutePath(this.flags.filename);
            if (!FileChecker.isExists(absolutePath)) {
                throw new Error('The file path ' + absolutePath + ' does not exists.');
            }
            const croppedData = await connector.avatar.upload(this.flags.type, this.flags.filename, this.flags.size);
            await connector.avatar.crop(this.flags.type, croppedData);
            response.status = 0;
            response.message = 'Avatar uploaded successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}