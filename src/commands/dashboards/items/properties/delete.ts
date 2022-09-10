import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../../libs/core/jiraResponse";

export default class Delete extends BaseCommand {
    static description = 'Removes the property from the dashboard item identified by the key or by the id. Ths user removing the property is required to have permissions to administer the dashboard item.';
    static examples = [
        `$ jiraserver dashboards:items:properties:delete -a "MyAlias" --dashboard "theDashboardId" --item "theItemId" --property "thePropertyId" --json`,
        `$ jiraserver dashboards:items:properties:delete -a "MyAlias" --dashboard "theDashboardId" --item "theItemId" --property "thePropertyId" --csv`,
        `$ jiraserver dashboards:items:properties:delete -a "MyAlias" --dashboard "theDashboardId" --item "theItemId" --property "thePropertyId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        dashboard: Flags.string({
            description: 'The Dashboard Id to delete item property',
            required: true,
            name: 'Dashboard Id',
        }),
        item: Flags.string({
            description: 'The Item Id to delete item property',
            required: true,
            name: 'Item Id',
        }),
        property: Flags.string({
            description: 'The Property Key to delete item property',
            required: true,
            name: 'Item Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.dashboards.items(this.flags.dashboard).properties(this.flags.item).delete(this.flags.property);
            response.result = result
            response.status = 0;
            response.message = this.getRecordDeletedText('Property');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}