import { Flags } from "@oclif/core";
import { FilterPermission, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { FilterPermissionsColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Returns a single share permission of the given filter. ' + UX.processDocumentation('<doc:FilterPermission>');
    static examples = [
        `$ jiraserver filters:permissions:get -a "MyAlias" --filter "theFilterId" --permission "thePermissionId" --json`,
        `$ jiraserver filters:permissions:get -a "MyAlias" --filter "theFilterId" --permission "thePermissionId" --csv`,
        `$ jiraserver filters:permissions:get -a "MyAlias" --filter "theFilterId" --permission "thePermissionId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        filter: Flags.string({
            description: 'The Filter Id to retrieve permission',
            required: true,
            name: 'Filter Id',
        }),
        permission: Flags.string({
            description: 'The Permission Id to retrieve',
            required: true,
            name: 'Permission Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<FilterPermission>> {
        const response = new JiraCLIResponse<FilterPermission>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.filters.permissions(this.flags.filter).get(this.flags.permission);
            response.result = result
            response.status = 0;
            response.message = this.getRecordRetrievedText('Permission');
            this.ux.log(response.message);
            this.ux.table<FilterPermission>([result], FilterPermissionsColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}