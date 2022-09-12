import { Flags } from '@oclif/core';
import { Attachment, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../libs/core/jiraResponse';
import { AttachmentColumns } from '../../libs/core/tables';
import { UX } from '../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns the meta-data for an attachment, including the URI of the actual attached file. ' + UX.processDocumentation('<doc:Attachment>');
    static examples = [
        '$ jiraserver attachments:get -a "MyAlias" --attachment "theAttachId" --json',
        '$ jiraserver attachments:get -a "MyAlias" --attachment "theAttachId" --csv',
        '$ jiraserver attachments:get -a "MyAlias" --attachment "theAttachId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        attachment: Flags.string({
            description: 'The Attachment Id to retrieve',
            required: true,
            name: 'Attachment Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<Attachment>> {
        const response = new JiraCLIResponse<Attachment>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.attachments.get(this.flags.attachment);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Attachment');
            this.ux.log(response.message);
            this.ux.table<Attachment>([result], AttachmentColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
