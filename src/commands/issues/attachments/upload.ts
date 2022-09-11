import { Flags } from "@oclif/core";
import { Attachment, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { AttachmentColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Upload extends BaseCommand {
    static description = 'Upload an attachment to an issue. Return the created attachment data. ' + UX.processDocumentation('<doc:Attachment>');
    static examples = [
        `$ jiraserver issues:attachments:upload -a "MyAlias" --issue "theIssueKeyOrId" --file "path/to/the/attachment" --json`,
        `$ jiraserver issues:attachments:upload -a "MyAlias" --issue "theIssueKeyOrId" --file "path/to/the/attachment" --csv`,
        `$ jiraserver issues:attachments:upload -a "MyAlias" --issue "theIssueKeyOrId" --file "path/to/the/attachment"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        file: Flags.file({
            description: 'The file path to upload',
            required: true,
            name: 'File path',
        }),
        issue: Flags.string({
            description: 'The Issue key or id to add attachment',
            required: true,
            name: 'Issue Key or Id',
        }),

    };
    async run(): Promise<JiraCLIResponse<Attachment[]>> {
        const response = new JiraCLIResponse<Attachment[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.attachments(this.flags.issue).upload(this.flags.file);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Worklog');
            this.ux.log(response.message);
            this.ux.table<Attachment>(result, AttachmentColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,

            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}