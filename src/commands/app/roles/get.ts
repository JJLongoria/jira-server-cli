import { Flags } from "@oclif/core";
import { ApplicationRole, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { AppRoleColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Return an application properties list. ' + UX.processDocumentation('<doc:ApplicationRole>');
    static examples = [
        `$ jiraserver app:roles:get -a "MyAlias" --role "theRoleKey" --json`,
        `$ jiraserver app:roles:get -a "MyAlias" --role "theRoleKey" --csv`,
        `$ jiraserver app:roles:get -a "MyAlias" --role "theRoleKey"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        role: Flags.string({
            description: 'The Role key to retrieve',
            required: true,
            name: 'Role Key'
        }),
    };
    async run(): Promise<JiraCLIResponse<ApplicationRole>> {
        const response = new JiraCLIResponse<ApplicationRole>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.applicationRoles.get(this.flags.role);
            response.result = result
            response.status = 0;
            response.message = this.getRecordRetrievedText('Application Role');
            this.ux.log(response.message);
            this.ux.table<ApplicationRole>([result], AppRoleColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}