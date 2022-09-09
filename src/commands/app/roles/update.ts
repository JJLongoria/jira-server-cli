import { Flags } from "@oclif/core";
import { ApplicationRole, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { AppRoleColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Updates the ApplicationRole with the passed data. Only the groups and default groups setting of the role may be updated. Requests to change the key or the name of the role will be silently ignored. If versionHash is passed through the If-Match header the request will be rejected if not the same as server. Return the updated role. ' + UX.processDocumentation('<doc:ApplicationRole>');
    static examples = [
        `$ jiraserver app:roles:update -a "MyAlias" --role "theRoleKey" --groups "group1, group2" --default-groups "group3, group4" --json`,
        `$ jiraserver app:roles:update -a "MyAlias" --role "theRoleKey" --groups "group1, group2" --csv`,
        `$ jiraserver app:roles:update -a "MyAlias" --role "theRoleKey" --default-groups "group3, group4"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        role: Flags.string({
            description: 'The Role key to update',
            required: true,
            name: 'Role Key'
        }),
        match: Flags.string({
            description: 'The hash of the version to update',
            required: false,
            name: 'If Match'
        }),
        groups: BuildFlags.array({
            description: 'Comma separated values of the groups to add',
            required: false,
            name: 'Groups',
        }),
        'default-groups': BuildFlags.array({
            description: 'Comma separated values of the default groups to add',
            required: false,
            name: 'Default Groups',
        }),
    };
    async run(): Promise<JiraCLIResponse<ApplicationRole>> {
        const response = new JiraCLIResponse<ApplicationRole>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.applicationRoles.update(this.flags.role, {
                key: this.flags.role,
                groups: this.flags.groups && this.flags.groups.length ? this.flags.groups : undefined,
                defaultGroups: this.flags['default-groups'] && this.flags['default-groups'].length ? this.flags['default-groups'] : undefined,
            }, this.flags.match);
            response.result = result
            response.status = 0;
            response.message = this.getRecordUpdatedText('Application Role');
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