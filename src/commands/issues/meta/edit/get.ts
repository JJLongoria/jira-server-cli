import { Flags } from "@oclif/core";
import { EditMeta, FieldMeta, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../../libs/core/jiraResponse";
import { FieldMetaColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Edit extends BaseCommand {
    static description = 'Returns the meta data for editing an issue. The fields in the editmeta correspond to the fields in the edit screen for the issue. Fields not in the screen will not be in the editmeta. ' + UX.processDocumentation('<doc:EditMeta>');
    static examples = [
        `$ jiraserver issues:meta:edit:get -a "MyAlias" --issue "theIssueKeyOrId" --json`,
        `$ jiraserver issues:meta:edit:get -a "MyAlias" --issue "theIssueKeyOrId" --csv`,
        `$ jiraserver issues:meta:edit:get -a "MyAlias" --issue "theIssueKeyOrId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        issue: Flags.string({
            description: 'The Issue key or id to get edit meta data',
            required: true,
            name: 'Issue Key or Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<EditMeta>> {
        const response = new JiraCLIResponse<EditMeta>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.editMeta(this.flags.issue).list();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Edit Meta');
            this.ux.log(response.message);
            this.ux.table<FieldMeta>(Object.values(result.fields), FieldMetaColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}