import { Flags } from "@oclif/core";
import { JiraServerConnector, Page, User } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { UserColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Create extends BaseCommand {
    static description = 'This resource returns a paginated list of users who are members of the specified group and its subgroups. Users in the page are ordered by user names. User of this resource is required to have sysadmin or admin permissions. ' + UX.processDocumentation('<doc:User>');
    static examples = [
        `$ jiraserver groups:users:list -a "MyAlias" --group "theGroupName" --json`,
        `$ jiraserver groups:users:list -a "MyAlias" --group "theGroupName" --inactive --csv`,
        `$ jiraserver groups:users:list -a "MyAlias" --group "theGroupName"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        ...BuildFlags.pagination(),
        group: Flags.string({
            description: 'The group name to retrieve users',
            required: true,
            name: 'Group',
        }),
        inactive: Flags.boolean({
            description: 'Inactive users will be included in the response',
            required: false,
            name: 'Inactive',
        }),
    };
    async run(): Promise<JiraCLIResponse<Page<User>>> {
        const response = new JiraCLIResponse<Page<User>>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<User> = new Page();
            if (this.flags.all) {
                let tmp = await connector.groups.members().list({
                    maxResults: 100,
                    startAt: 0,
                    groupname: this.flags.group,
                    includeInactiveUsers: this.flags.inactive,
                });
                result.values.push(...tmp.values);
                result.isLast = true;
                result.startAt = tmp.startAt;
                while (!tmp.isLast) {
                    tmp = await connector.groups.members().list({
                        startAt: tmp.nextPageStart,
                        maxResults: 100,
                        groupname: this.flags.group,
                        includeInactiveUsers: this.flags.inactive,
                    });
                    result.values.push(...tmp.values);
                }
                result.maxResults = result.values.length;
            } else {
                result = await connector.groups.members().list({
                    maxResults: this.flags.limit,
                    startAt: this.flags.start,
                    groupname: this.flags.group,
                    includeInactiveUsers: this.flags.inactive
                });
            }
            response.result = result
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'User');
            this.ux.log(response.message);
            this.ux.table<User>(result.values, UserColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}