import { IssueLinkType, IssueLinkTypes, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { IssueLinkTypeColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns a list of available issue link types, if issue linking is enabled. Each issue link type has an id, a name and a label for the outward and inward link relationship. ' + UX.processDocumentation('<doc:IssueLinkTypes>');
    static examples = [
        '$ jiraserver issues:links:types:list -a "MyAlias" --json',
        '$ jiraserver issues:links:types:list -a "MyAlias" --csv',
        '$ jiraserver issues:links:types:list -a "MyAlias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
    };

    async run(): Promise<JiraCLIResponse<IssueLinkTypes>> {
        const response = new JiraCLIResponse<IssueLinkTypes>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueLinks.types().list();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.issueLinkTypes.length, 'Issue Link Type');
            this.ux.log(response.message);
            this.ux.table<IssueLinkType>(result.issueLinkTypes, IssueLinkTypeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
