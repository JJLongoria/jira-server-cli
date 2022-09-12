import { Flags } from '@oclif/core';
import { FilterPermission, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { FilterPermissionsColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns all share permissions of the given filter. ' + UX.processDocumentation('<doc:FilterPermission>');
    static examples = [
        '$ jiraserver filters:permissions:list -a "MyAlias" --filter "theFilterId" --json',
        '$ jiraserver filters:permissions:list -a "MyAlias" --filter "theFilterId" --csv',
        '$ jiraserver filters:permissions:list -a "MyAlias" --filter "theFilterId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        filter: Flags.string({
            description: 'The Filter Id to retrieve permissions',
            required: true,
            name: 'Filter Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<FilterPermission[]>> {
        const response = new JiraCLIResponse<FilterPermission[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.filters.permissions(this.flags.filter).list();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.length, 'Permission');
            this.ux.log(response.message);
            this.ux.table<FilterPermission>(result, FilterPermissionsColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
