import { Flags } from "@oclif/core";
import { ApplicationProperty, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { AppPropertyColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Update extends BaseCommand {
    static description = 'Modify an application property. The "value" field present in will override the existing value. ' + UX.processDocumentation('<doc:ApplicationProperty>');
    static examples = [
        `$ jiraserver app:properties:update -a "MyAlias" --property "propertyKey" --value "TheValue" --json`,
        `$ jiraserver app:properties:update -a "MyAlias" --property "propertyKey" --value "TheValue" --csv`,
        `$ jiraserver app:properties:update -a "MyAlias" --property "propertyKey" --value "TheValue"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        property: Flags.string({
            description: 'The property key to update',
            required: true,
            name: 'Property'
        }),
        value: Flags.string({
            description: 'The property value to set',
            required: true,
            name: 'Value'
        }),
    };
    async run(): Promise<JiraCLIResponse<ApplicationProperty>> {
        const response = new JiraCLIResponse<ApplicationProperty>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.applicationProperties.update(this.flags.property, this.flags.value);
            response.result = result
            response.status = 0;
            response.message = this.getRecordUpdatedText('Application Property');
            this.ux.log(response.message);
            this.ux.table<ApplicationProperty>([result], AppPropertyColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}