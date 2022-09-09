import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { InstanceColumns } from "../../libs/core/tables";
import { Instance } from "../../libs/types";

export default class List extends BaseCommand {
    static description = 'List al authorized Jira instances.';
    static examples = [
        `$ jiraserver auth:list`,
        `$ jiraserver auth:list`,
        `$ jiraserver auth:list`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
    };
    async run(): Promise<JiraCLIResponse<Instance[]>> {
        const response = new JiraCLIResponse<Instance[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            response.result = Object.values(this.localConfig.instances);
            response.status = 0;
            response.message = this.getRecordsFoundText(response.result.length, 'Instance');
            this.ux.log(response.message);
            this.ux.table<Instance>(response.result, InstanceColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}