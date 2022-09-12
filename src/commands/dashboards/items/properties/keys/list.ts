import { Flags } from '@oclif/core';
import { EntityPropertyKey, EntityPropertyKeys, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../../libs/core/jiraResponse';
import { EntityPropertyKeyColumns } from '../../../../../libs/core/tables';
import { UX } from '../../../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns the keys of all properties for the dashboard item identified by the id. ' + UX.processDocumentation('<doc:EntityPropertyKeys>');
    static examples = [
        '$ jiraserver dashboards:items:properties:keys:get -a "MyAlias" --dashboard "theDashboardId" --item "theItemId" --json',
        '$ jiraserver dashboards:items:properties:keys:get -a "MyAlias" --dashboard "theDashboardId" --item "theItemId" --csv',
        '$ jiraserver dashboards:items:properties:keys:get -a "MyAlias" --dashboard "theDashboardId" --item "theItemId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        dashboard: Flags.string({
            description: 'The Dashboard Id to retrieve item properties',
            required: true,
            name: 'Dashboard Id',
        }),
        item: Flags.string({
            description: 'The Item Id to retrieve item properties',
            required: true,
            name: 'Item Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<EntityPropertyKeys>> {
        const response = new JiraCLIResponse<EntityPropertyKeys>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.dashboards.items(this.flags.dashboard).properties(this.flags.item).list();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.keys.length, 'Property Keys');
            this.ux.log(response.message);
            this.ux.table<EntityPropertyKey>([result.keys], EntityPropertyKeyColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
