import { Flags } from '@oclif/core';
import { ComponentIssuesCount, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { ComponentIssuesCountColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns counts of issues related to this component. ' + UX.processDocumentation('<doc:ComponentIssuesCount>');
    static examples = [
        '$ jiraserver components:issues:count -a "MyAlias" --component "theComponentId" --json',
        '$ jiraserver components:issues:count -a "MyAlias" --component "theComponentId" --csv',
        '$ jiraserver components:issues:count -a "MyAlias" --component "theComponentId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        component: Flags.string({
            description: 'The Component Id to count issues',
            required: true,
            name: 'Component Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<ComponentIssuesCount>> {
        const response = new JiraCLIResponse<ComponentIssuesCount>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.components.countIssues(this.flags.component);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Component');
            this.ux.log(response.message);
            this.ux.table<ComponentIssuesCount>([result], ComponentIssuesCountColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
