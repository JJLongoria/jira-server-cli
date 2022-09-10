import { Field, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { FieldColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Returns a list of all fields, both System and Custom. ' + UX.processDocumentation('<doc:Field>');
    static examples = [
        `$ jiraserver fields:list -a "MyAlias" --json`,
        `$ jiraserver fields:list -a "MyAlias"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
    };
    async run(): Promise<JiraCLIResponse<Field[]>> {
        const response = new JiraCLIResponse<Field[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.fields.list();
            response.result = result
            response.status = 0;
            response.message = this.getRecordsFoundText(result.length, 'Field');
            this.ux.log(response.message);
            this.ux.table<Field>([result.values], FieldColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}