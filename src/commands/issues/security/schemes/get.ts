import { Flags } from '@oclif/core';
import { JiraServerConnector, SecurityScheme } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { SecuritySchemeColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class Get extends BaseCommand {
    static description = 'Returns all issue security schemes that are defined. ' + UX.processDocumentation('<doc:SecurityScheme>');
    static examples = [
        '$ jiraserver issues:security:schemes:get -a "MyAlias" --scheme "theSchemeId" --json',
        '$ jiraserver issues:security:schemes:get -a "MyAlias" --scheme "theSchemeId" --csv',
        '$ jiraserver issues:security:schemes:get -a "MyAlias" --scheme "theSchemeId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        scheme: Flags.string({
            description: 'The Security Scheme id to retrieve',
            required: true,
            name: 'Scheme',
        }),
    };

    async run(): Promise<JiraCLIResponse<SecurityScheme>> {
        const response = new JiraCLIResponse<SecurityScheme>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueSecuritySchemes.get(this.flags.scheme);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Issue Security Scheme');
            this.ux.log(response.message);
            this.ux.table<SecurityScheme>([result], SecuritySchemeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
