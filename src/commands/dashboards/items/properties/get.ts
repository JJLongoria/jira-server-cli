import { Flags } from '@oclif/core';
import { EntityProperty, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { EntityPropertyColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns the value of the property with a given key from the dashboard item identified by the id. The user who retrieves the property is required to have permissions to read the dashboard item. ' + UX.processDocumentation('<doc:EntityProperty>');
    static examples = [
        '$ jiraserver dashboards:items:properties:get -a "MyAlias" --dashboard "theDashboardId" --item "theItemId" --property "thePropertyId" --json',
        '$ jiraserver dashboards:items:properties:get -a "MyAlias" --dashboard "theDashboardId" --item "theItemId" --property "thePropertyId" --csv',
        '$ jiraserver dashboards:items:properties:get -a "MyAlias" --dashboard "theDashboardId" --item "theItemId" --property "thePropertyId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        dashboard: Flags.string({
            description: 'The Dashboard Id to retrieve item property',
            required: true,
            name: 'Dashboard Id',
        }),
        item: Flags.string({
            description: 'The Item Id to retrieve item property',
            required: true,
            name: 'Item Id',
        }),
        property: Flags.string({
            description: 'The Property Key to retrieve item property',
            required: true,
            name: 'Item Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<EntityProperty>> {
        const response = new JiraCLIResponse<EntityProperty>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.dashboards.items(this.flags.dashboard).properties(this.flags.item).get(this.flags.property);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Property');
            this.ux.log(response.message);
            this.ux.table<EntityProperty>([result], EntityPropertyColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
