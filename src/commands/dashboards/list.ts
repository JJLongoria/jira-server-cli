import { Flags } from '@oclif/core';
import { Dashboard, JiraServerConnector, Page } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../libs/core/jiraResponse';
import { DashboardColumns } from '../../libs/core/tables';
import { UX } from '../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns a list of all dashboards, optionally filtering them. ' + UX.processDocumentation('<doc:Dashboard>');
    static examples = [
        '$ jiraserver dashboards:list -a "MyAlias" --filter "theFilterValue" --json',
        '$ jiraserver dashboards:list -a "MyAlias" -s 25 -l 50 --csv',
        '$ jiraserver dashboards:list -a "MyAlias" --all',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        ...BuildFlags.pagination(),
        filter: Flags.string({
            description: 'An optional filter that is applied to the list of dashboards. Valid values include "favourite" for returning only favourite dashboards, and "my" for returning dashboards that are owned by the calling user.',
            required: false,
            name: 'Filter',
        }),
    };

    async run(): Promise<JiraCLIResponse<Page<Dashboard>>> {
        const response = new JiraCLIResponse<Page<Dashboard>>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Dashboard> = new Page();
            if (this.flags.all) {
                let tmp = await connector.dashboards.list(this.flags.filter, this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLast = true;
                result.startAt = tmp.startAt;
                while (!tmp.isLast) {
                    tmp = await connector.dashboards.list(this.flags.filter, {
                        startAt: tmp.nextPageStart,
                        maxResults: 100,
                    });
                    result.values.push(...tmp.values);
                }

                result.maxResults = result.values.length;
            } else {
                result = await connector.dashboards.list(this.flags.filter, this.pageOptions);
            }

            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Dashboard');
            this.ux.log(response.message);
            this.ux.table<Dashboard>([result.values], DashboardColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
