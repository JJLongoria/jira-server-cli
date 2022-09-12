import { JiraServerConnector, ShareScope } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { ShareScopeColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns the default share scope of the logged-in user. ' + UX.processDocumentation('<doc:ShareScope>');
    static examples = [
        '$ jiraserver filters:scope:get -a "MyAlias" --json',
        '$ jiraserver filters:scope:get -a "MyAlias" --csv',
        '$ jiraserver filters:scope:get -a "MyAlias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
    };

    async run(): Promise<JiraCLIResponse<ShareScope>> {
        const response = new JiraCLIResponse<ShareScope>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.filters.defaultShareScope().get();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Share Scope');
            this.ux.log(response.message);
            this.ux.table<ShareScope>([result], ShareScopeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
