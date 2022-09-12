import { Field, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { FieldColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Create extends BaseCommand {
    static description = 'Creates a custom field using a definition (object encapsulating custom field data). ' + UX.processDocumentation('<doc:Field>');
    static examples = [
        '$ jiraserver fields:custom:create -a "MyAlias" --data "{\'id\':\'customfield_10000\',\'name\':\'New custom field\',\'description\':\'Custom field for picking groups\',\'type\':\'com.atlassian.jira.plugin.system.customfieldtypes:grouppicker\',\'searcherKey\':\'com.atlassian.jira.plugin.system.customfieldtypes:grouppickersearcher\'}" --json',
        '$ jiraserver fields:custom:create -a "MyAlias" --file "path/to/the/json/data/file" --csv',
        '$ jiraserver fields:custom:create -a "MyAlias" --file "path/to/the/json/data/file"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        data: BuildFlags.input.jsonData('<doc:CustomFieldDefinition>'),
        file: BuildFlags.input.jsonFile('<doc:CustomFieldDefinition>'),
    };

    async run(): Promise<JiraCLIResponse<Field>> {
        const response = new JiraCLIResponse<Field>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.fields.create(this.getJSONInputData());
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Custom Field');
            this.ux.log(response.message);
            this.ux.table<Field>([result], FieldColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
