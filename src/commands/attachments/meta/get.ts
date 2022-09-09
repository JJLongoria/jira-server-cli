import { Flags } from "@oclif/core";
import { AttachmentMeta, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { AttachmentMetaColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Returns the meta information for an attachments, specifically if they are enabled and the maximum upload size allowed. ' + UX.processDocumentation('<doc:AttachmentMeta>');
    static examples = [
        `$ jiraserver attachments:meta:get -a "MyAlias" --json`,
        `$ jiraserver attachments:meta:get -a "MyAlias" --csv`,
        `$ jiraserver attachments:meta:get -a "MyAlias"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
    };
    async run(): Promise<JiraCLIResponse<AttachmentMeta>> {
        const response = new JiraCLIResponse<AttachmentMeta>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.attachments.getMeta();
            response.result = result
            response.status = 0;
            response.message = this.getRecordRetrievedText('Attachment Meta');
            this.ux.log(response.message);
            this.ux.table<AttachmentMeta>([result], AttachmentMetaColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}