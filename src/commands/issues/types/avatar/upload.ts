import { Flags } from "@oclif/core";
import { Avatar, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../../libs/core/jiraResponse";
import { AvatarColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";
import { FileChecker, PathUtils } from "../../../../libs/fileSystem";

export default class Upload extends BaseCommand {
    static description = 'Upload new Issue Type avatar. This process include all steps to upload new avatar, that is, upload the file, and crop the avatar. ' + UX.processDocumentation('<doc:Avatar>');
    static examples = [
        '$ jiraserver issues:types:avatar:upload -a "MyAlias" --type "theIssueTypeId" --filename "path/to/avatar" --json',
        '$ jiraserver issues:types:avatar:upload -a "MyAlias" --type "theIssueTypeId" --filename "path/to/avatar" --csv',
        '$ jiraserver issues:types:avatar:upload -a "MyAlias" --type "theIssueTypeId" --filename "path/to/avatar"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        type: Flags.string({
            description: 'The Issue Type Id to upload the avatar',
            required: true,
            name: 'Issue Type Id',
        }),
        filename: Flags.file({
            description: 'The image\'s filename to upload',
            required: true,
            name: 'If Match',
        }),
        size: Flags.integer({
            description: 'Size of file',
            required: true,
            name: 'Size',
        }),
    };

    async run(): Promise<JiraCLIResponse<Avatar>> {
        const response = new JiraCLIResponse<Avatar>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const absolutePath = PathUtils.getAbsolutePath(this.flags.filename);
            if (!FileChecker.isExists(absolutePath)) {
                throw new Error('The file path ' + absolutePath + ' does not exists.');
            }

            const croppedData = await connector.issueTypes.avatar(this.flags.type).upload(this.flags.filename, this.flags.size);
            const result = await connector.issueTypes.avatar(this.flags.type).crop(croppedData);
            await connector.issueTypes.avatar(this.flags.type).confirm(result);
            response.result = result;
            response.status = 0;
            response.message = 'Avatar uploaded successfully';
            this.ux.log(response.message);
            this.ux.table<Avatar>([result], AvatarColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
