import { Flags } from "@oclif/core";
import { ApplicationRole, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../../libs/core/jiraResponse";
import { AppRoleColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Update extends BaseCommand {
    static description = 'Updates the Application Roles with the passed data if the version hash is the same as the server. Only the groups and default groups setting of the role may be updated. Requests to change the key or the name of the role will be silently ignored. Return the updated roles. ' + UX.processDocumentation('<doc:ApplicationRole>');
    static examples = [
        `$ jiraserver app:roles:bulk:update -a "MyAlias" --data "{'key':'jira-software', 'groups':['jira-software-users','jira-testers'], 'defaultGroups':['jira-software-users']}"  --json`,
        `$ jiraserver app:roles:bulk:update -a "MyAlias" --file "path/to/the/json/data/file" --csv`,
        `$ jiraserver app:roles:bulk:update -a "MyAlias" --file "path/to/the/json/data/file"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        data: BuildFlags.input.jsonData('<doc:ApplicationRoleInput>'),
        file: BuildFlags.input.jsonFile('<doc:ApplicationRoleInput>'),
        match: Flags.string({
            description: 'The hash of the version to update',
            required: false,
            name: 'If Match'
        }),
    };
    async run(): Promise<JiraCLIResponse<ApplicationRole[]>> {
        const response = new JiraCLIResponse<ApplicationRole[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.applicationRoles.updateBulk(this.getJSONInputData(), this.flags.match);
            response.result = result
            response.status = 0;
            response.message = this.getRecordUpdatedText('Application Role');
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