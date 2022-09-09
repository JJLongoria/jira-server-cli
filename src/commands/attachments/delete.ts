import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";

export default class Delete extends BaseCommand {
    static description = 'Remove an attachment from an issue.';
    static examples = [
        `$ jiraserver attachments:get -a "MyAlias" --attachment "theAttachId" --json`,
        `$ jiraserver attachments:get -a "MyAlias" --attachment "theAttachId" --csv`,
        `$ jiraserver attachments:get -a "MyAlias" --attachment "theAttachId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        attachment: Flags.string({
            description: 'The Attachment Id to delete',
            required: true,
            name: 'Attachment Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.attachments.delete(this.flags.attachment);
            response.status = 0;
            response.message = this.getRecordDeletedText('Attachment');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}