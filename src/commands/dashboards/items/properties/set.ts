import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../../libs/core/jiraResponse";

export default class Set extends BaseCommand {
    static description = 'Sets the value of the specified dashboard item\'s property. ';
    static examples = [
        `$ jiraserver dashboards:items:properties:set -a "MyAlias" --dashboard "theDashboardId" --item "theItemId" --property "thePropertyId" --value "theValue" --json`,
        `$ jiraserver dashboards:items:properties:set -a "MyAlias" --dashboard "theDashboardId" --item "theItemId" --property "thePropertyId" --value "theValue" --csv`,
        `$ jiraserver dashboards:items:properties:set -a "MyAlias" --dashboard "theDashboardId" --item "theItemId" --property "thePropertyId" --value "theValue"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        dashboard: Flags.string({
            description: 'The Dashboard Id to set item property',
            required: true,
            name: 'Dashboard Id',
        }),
        item: Flags.string({
            description: 'The Item Id to set item property',
            required: true,
            name: 'Item Id',
        }),
        property: Flags.string({
            description: 'The Property Key to set',
            required: true,
            name: 'Item Id',
        }),
        value: Flags.string({
            description: 'The Property value to set',
            required: true,
            name: 'Item Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.dashboards.items(this.flags.dashboard).properties(this.flags.item).set(this.flags.property, this.flags.value);
            response.result = result
            response.status = 0;
            response.message = this.getRecordUpdatedText('Property');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}