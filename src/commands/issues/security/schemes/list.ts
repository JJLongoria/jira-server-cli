import { IssueSecuritySchemes, JiraServerConnector, SecurityScheme } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../../libs/core/jiraResponse";
import { SecuritySchemeColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Returns all issue security schemes that are defined. ' + UX.processDocumentation('<doc:IssueSecuritySchemes>');
    static examples = [
        `$ jiraserver issues:security:schemes:list -a "MyAlias" --json`,
        `$ jiraserver issues:security:schemes:list -a "MyAlias" --csv`,
        `$ jiraserver issues:security:schemes:list -a "MyAlias"`,
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
    };

    async run(): Promise<JiraCLIResponse<IssueSecuritySchemes>> {
        const response = new JiraCLIResponse<IssueSecuritySchemes>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueSecuritySchemes.list();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.issueSecuritySchemes.length, 'Issue Security Scheme');
            this.ux.log(response.message);
            this.ux.table<SecurityScheme>(result.issueSecuritySchemes, SecuritySchemeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}