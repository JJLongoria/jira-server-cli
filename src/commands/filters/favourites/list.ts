import { Flags } from '@oclif/core';
import { Filter, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { FilterColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns the favourite filters of the logged-in user. ' + UX.processDocumentation('<doc:Filter>');
    static examples = [
        '$ jiraserver filters:get -a "MyAlias" --json',
        '$ jiraserver filters:get -a "MyAlias" --csv',
        '$ jiraserver filters:get -a "MyAlias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        expand: BuildFlags.expand(),
    };

    async run(): Promise<JiraCLIResponse<Filter[]>> {
        const response = new JiraCLIResponse<Filter[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.filters.favourites().list(this.flags.expand);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.length, 'Filter');
            this.ux.log(response.message);
            this.ux.table<Filter>(result, FilterColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
