import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';

export default class Reset extends BaseCommand {
    static description = 'Returns the default columns for the given filter. Currently logged in user will be used as the user making such request.';
    static examples = [
        '$ jiraserver filters:columns:reset -a "MyAlias" --filter "theFilterId" --json',
        '$ jiraserver filters:columns:reset -a "MyAlias" --filter "theFilterId" --csv',
        '$ jiraserver filters:columns:reset -a "MyAlias" --filter "theFilterId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        filter: Flags.string({
            description: 'The Filter Id to reset columns',
            required: true,
            name: 'Filter Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.filters.columns(this.flags.filter).reset();
            response.result = result;
            response.status = 0;
            response.message = 'Filter Columns reset successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
