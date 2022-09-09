import { Flags } from "@oclif/core";
import { ApplicationProperty, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { AppPropertyColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Return an application properties list. ' + UX.processDocumentation('<doc:ApplicationProperty>');
    static examples = [
        `$ jiraserver app:properties:list -a "MyAlias" --key "propertyKey" --json`,
        `$ jiraserver app:properties:list -a "MyAlias" --filter "filterValue" --csv`,
        `$ jiraserver app:properties:list -a "MyAlias"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        key: Flags.string({
            description: 'A String containing the property key',
            required: false,
            name: 'Key'
        }),
        permission: Flags.string({
            description: 'When fetching a list specifies the permission level of all items in the list',
            required: false,
            name: 'Permission'
        }),
        filter: Flags.string({
            description: 'When fetching a list allows the list to be filtered by the property\'s start of key e.g. "jira.lf.*" whould fetch only those permissions that are editable and whose keys start with "jira.lf.". This is a regex.',
            required: false,
            name: 'Filter'
        }),
    };
    async run(): Promise<JiraCLIResponse<ApplicationProperty[]>> {
        const response = new JiraCLIResponse<ApplicationProperty[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.applicationProperties.list({
                key: this.flags.key,
                keyFilter: this.flags.filter,
                permissionLevel: this.flags.permission,
            });
            response.result = result
            response.status = 0;
            response.message = this.getRecordsFoundText(response.result.length, 'Application Property');
            this.ux.log(response.message);
            this.ux.table<ApplicationProperty>(response.result, AppPropertyColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}