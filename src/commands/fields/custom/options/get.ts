import { Flags } from '@oclif/core';
import { CustomFieldOption, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { CustomFieldOptionColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns a full representation of the Custom Field Option that has the given id. ' + UX.processDocumentation('<doc:CustomFieldOption>');
    static examples = [
        '$ jiraserver fields:custom:options:get -a "MyAlias" --field "theFieldId" --json',
        '$ jiraserver fields:custom:options:get -a "MyAlias" --field "theFieldId" --csv',
        '$ jiraserver fields:custom:options:get -a "MyAlias" --field "theFieldId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        field: Flags.string({
            description: 'The Field Id to retrieve options',
            required: true,
            name: 'Custom Field Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<CustomFieldOption>> {
        const response = new JiraCLIResponse<CustomFieldOption>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.customFields.options(this.flags.field);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Custom Field Option');
            this.ux.log(response.message);
            this.ux.table<CustomFieldOption>([result], CustomFieldOptionColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
