import { Flags } from '@oclif/core';
import { ColumnItem, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { ColumnItemColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns the default columns for the given filter. Currently logged in user will be used as the user making such request. ' + UX.processDocumentation('<doc:ColumnItem>');
    static examples = [
        '$ jiraserver filters:columns:list -a "MyAlias" --filter "theFilterId" --json',
        '$ jiraserver filters:columns:list -a "MyAlias" --filter "theFilterId" --csv',
        '$ jiraserver filters:columns:list -a "MyAlias" --filter "theFilterId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        filter: Flags.string({
            description: 'The Filter Id to retrieve columns',
            required: true,
            name: 'Filter Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<ColumnItem[]>> {
        const response = new JiraCLIResponse<ColumnItem[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.filters.columns(this.flags.filter).list();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.length, 'Column');
            this.ux.log(response.message);
            this.ux.table<ColumnItem>(result, ColumnItemColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
