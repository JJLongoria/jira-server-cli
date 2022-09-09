import { Flags } from "@oclif/core";
import { Component, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { ComponentColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Returns a project component. ' + UX.processDocumentation('<doc:Component>');
    static examples = [
        `$ jiraserver components:get -a "MyAlias" --component "theComponentId" --json`,
        `$ jiraserver components:get -a "MyAlias" --component "theComponentId" --csv`,
        `$ jiraserver components:get -a "MyAlias" --component "theComponentId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        component: Flags.string({
            description: 'The Component Id to retrieve',
            required: true,
            name: 'Component Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<Component>> {
        const response = new JiraCLIResponse<Component>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.components.get(this.flags.component);
            response.result = result
            response.status = 0;
            response.message = this.getRecordRetrievedText('Component');
            this.ux.log(response.message);
            this.ux.table<Component>([result], ComponentColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}