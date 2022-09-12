import { Flags } from '@oclif/core';
import { IssueLinkType, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { IssueLinkTypeColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class Update extends BaseCommand {
    static description = 'Update the specified issue link type. ' + UX.processDocumentation('<doc:IssueLinkType>');
    static examples = [
        '$ jiraserver issues:links:types:update -a "MyAlias" --type "theIssueLinkTypeId" --name "Duplicate" --inward "inwardValue" --outward "outwardValue" --json',
        '$ jiraserver issues:links:types:update -a "MyAlias" --type "theIssueLinkTypeId" --name "Duplicate" --inward "inwardValue" --outward "outwardValue" --csv',
        '$ jiraserver issues:links:types:update -a "MyAlias" --type "theIssueLinkTypeId" --name "Duplicate" --inward "inwardValue" --outward "outwardValue"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        type: Flags.string({
            description: 'The Issue Link Type Id to update',
            required: true,
            name: 'Issue Link Type',
        }),
        name: Flags.string({
            description: 'The name of the issue type',
            required: true,
            name: 'Name',
        }),
        inward: Flags.string({
            description: 'Inward Value',
            required: true,
            name: 'Inward',
        }),
        outward: Flags.string({
            description: 'Outward Value',
            required: true,
            name: 'Outward',
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueLinkType>> {
        const response = new JiraCLIResponse<IssueLinkType>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueLinks.types().update(this.flags.type, {
                inward: this.flags.inward,
                outward: this.flags.outward,
                name: this.flags.name,
            });
            response.result = result;
            response.status = 0;
            response.message = this.getRecordUpdatedText('Issue Link Type');
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
