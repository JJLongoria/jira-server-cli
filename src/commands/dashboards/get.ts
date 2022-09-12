import { Flags } from '@oclif/core';
import { Dashboard, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../libs/core/jiraResponse';
import { DashboardColumns } from '../../libs/core/tables';
import { UX } from '../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns a single dashboard. ' + UX.processDocumentation('<doc:Dashboard>');
    static examples = [
        '$ jiraserver dashboards:get -a "MyAlias" --dashboard "theDashboardId" --json',
        '$ jiraserver dashboards:get -a "MyAlias" --dashboard "theDashboardId" --csv',
        '$ jiraserver dashboards:get -a "MyAlias" --dashboard "theDashboardId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        dashboard: Flags.string({
            description: 'The Dashboard Id to retrieve',
            required: true,
            name: 'Dashboard Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<Dashboard>> {
        const response = new JiraCLIResponse<Dashboard>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.dashboards.get(this.flags.dashboard);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Dashboard');
            this.ux.log(response.message);
            this.ux.table<Dashboard>([result], DashboardColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
