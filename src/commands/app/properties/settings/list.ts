import { ApplicationProperty, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../../libs/core/jiraResponse";
import { AppPropertyColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Returns the properties that are displayed on the "General Configuration > Advanced Settings" page. ' + UX.processDocumentation('<doc:ApplicationProperty>');
    static examples = [
        `$ jiraserver app:properties:settings:list -a "MyAlias" --json`,
        `$ jiraserver app:properties:settings:list -a "MyAlias" --csv`,
        `$ jiraserver app:properties:settings:list -a "MyAlias"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
    };
    async run(): Promise<JiraCLIResponse<ApplicationProperty[]>> {
        const response = new JiraCLIResponse<ApplicationProperty[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.applicationProperties.listAdvanceSettings();
            response.result = result
            response.status = 0;
            response.message = this.getRecordsFoundText(response.result.length, 'Application Property');
            this.ux.log(response.message);
            this.ux.table<ApplicationProperty>(response.result, AppPropertyColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}