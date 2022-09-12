import { Flags } from '@oclif/core';
import { IssueLinkType, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { IssueLinkTypeColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns for a given issue link type id all information about this issue link type. ' + UX.processDocumentation('<doc:IssueLinkType>');
    static examples = [
        '$ jiraserver issues:links:types:get -a "MyAlias" --type "theIssueLinkTypeId" --json',
        '$ jiraserver issues:links:types:get -a "MyAlias" --type "theIssueLinkTypeId" --csv',
        '$ jiraserver issues:links:types:get -a "MyAlias" --type "theIssueLinkTypeId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        type: Flags.string({
            description: 'The Issue Link Type Id to retrieve',
            required: true,
            name: 'Issue Link Type',
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueLinkType>> {
        const response = new JiraCLIResponse<IssueLinkType>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueLinks.types().get(this.flags.type);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Issue Link Type');
            this.ux.log(response.message);
            this.ux.table<IssueLinkType>([result], IssueLinkTypeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
