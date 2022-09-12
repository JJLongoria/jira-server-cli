import { Component, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../libs/core/jiraResponse';
import { ComponentColumns } from '../../libs/core/tables';
import { UX } from '../../libs/core/ux';

export default class Create extends BaseCommand {
    static description = 'Create a component . Return the created component. ' + UX.processDocumentation('<doc:Component>');
    static examples = [
        '$ jiraserver components:create -a "MyAlias" --data "{\'name\':\'Component 1\',\'description\':\'This is a Jira component\',\'leadUserName\':\'fred\',\'assigneeType\':\'PROJECT_LEAD\',\'isAssigneeTypeValid\':false,\'project\':\'PROJECTKEY\',\'projectId\':10000}"  --json',
        '$ jiraserver components:create -a "MyAlias" --file "path/to/the/json/data/file" --csv',
        '$ jiraserver components:create -a "MyAlias" --file "path/to/the/json/data/file"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        data: BuildFlags.input.jsonData('<doc:ComponentInput>'),
        file: BuildFlags.input.jsonFile('<doc:ComponentInput>'),
    };

    async run(): Promise<JiraCLIResponse<Component>> {
        const response = new JiraCLIResponse<Component>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.components.create(this.getJSONInputData());
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Component');
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
