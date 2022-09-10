import { Flags } from "@oclif/core";
import { Component, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { ComponentColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class Update extends BaseCommand {
    static description = 'Modify a component via PUT. Any fields present in the PUT will override existing values. As a convenience, if a field is not present, it is silently ignored. Return the update component. ' + UX.processDocumentation('<doc:Component>');
    static examples = [
        `$ jiraserver components:update -a "MyAlias" --component "theComponentId" --data "{'name':'Component 1','description':'This is a Jira component','leadUserName':'fred','assigneeType':'PROJECT_LEAD','isAssigneeTypeValid':false,'project':'PROJECTKEY','projectId':10000}"  --json`,
        `$ jiraserver components:update -a "MyAlias" --component "theComponentId" --file "path/to/the/json/data/file" --csv`,
        `$ jiraserver components:update -a "MyAlias" --component "theComponentId" --file "path/to/the/json/data/file"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        data: BuildFlags.input.jsonData('<doc:ComponentInput>'),
        file: BuildFlags.input.jsonFile('<doc:ComponentInput>'),
        component: Flags.string({
            description: 'The Component Id to update',
            required: true,
            name: 'Component Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<Component>> {
        const response = new JiraCLIResponse<Component>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.components.update(this.flags.component, this.getJSONInputData());
            response.result = result
            response.status = 0;
            response.message = this.getRecordUpdatedText('Component');
            this.ux.log(response.message);
            this.ux.table<Component>([result], ComponentColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}