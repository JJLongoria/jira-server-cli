import { Flags } from '@oclif/core';
import { Filter, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../libs/core/jiraResponse';
import { FilterColumns } from '../../libs/core/tables';
import { UX } from '../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns a filter given an id. ' + UX.processDocumentation('<doc:Filter>');
    static examples = [
        '$ jiraserver filters:get -a "MyAlias" --filter "theFilterId" --json',
        '$ jiraserver filters:get -a "MyAlias" --filter "theFilterId" --csv',
        '$ jiraserver filters:get -a "MyAlias" --filter "theFilterId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        expand: BuildFlags.expand(),
        filter: Flags.string({
            description: 'The Filter Id to retrieve',
            required: true,
            name: 'Filter Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<Filter>> {
        const response = new JiraCLIResponse<Filter>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.filters.get(this.flags.filter, this.flags.expand);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Filter');
            this.ux.log(response.message);
            this.ux.table<Filter>([result], FilterColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
