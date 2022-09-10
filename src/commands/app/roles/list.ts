import { ApplicationRole, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { AppRoleColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Return an application properties list. ' + UX.processDocumentation('<doc:ApplicationRole>');
    static examples = [
        `$ jiraserver app:roles:list -a "MyAlias" --key "propertyKey" --json`,
        `$ jiraserver app:roles:list -a "MyAlias" --filter "filterValue" --csv`,
        `$ jiraserver app:roles:list -a "MyAlias"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
    };
    async run(): Promise<JiraCLIResponse<ApplicationRole[]>> {
        const response = new JiraCLIResponse<ApplicationRole[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.applicationRoles.list();
            response.result = result
            response.status = 0;
            response.message = this.getRecordsFoundText(response.result.length, 'Application Role');
            this.ux.log(response.message);
            this.ux.table<ApplicationRole>(response.result, AppRoleColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}