import { Flags } from "@oclif/core";
import { DeletedFieldsOutput, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { DeletedFieldsColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Delete extends BaseCommand {
    static description = 'Delete custom fields. ' + UX.processDocumentation('<doc:DeletedFieldsOutput>');
    static examples = [
        `$ jiraserver fields:custom:delete -a "MyAlias" --fields "theFieldId1, theFieldId2, theFieldId3" --json`,
        `$ jiraserver fields:custom:delete -a "MyAlias" --fields "theFieldId1" --csv`,
        `$ jiraserver fields:custom:delete -a "MyAlias" --fields "theFieldId1, theFieldId2"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        fields: BuildFlags.array({
            description: 'Comma separated values of field ids to delete',
            required: true,
            name: 'Custom Field Ids',
        }),
    };
    async run(): Promise<JiraCLIResponse<DeletedFieldsOutput>> {
        const response = new JiraCLIResponse<DeletedFieldsOutput>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.customFields.deleteBulk(this.flags.fields);
            response.result = result
            response.status = 0;
            response.message = this.getRecordDeletedText('Custom Field(s)');
            this.ux.log(response.message);
            this.ux.table<DeletedFieldsOutput>([result], DeletedFieldsColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}