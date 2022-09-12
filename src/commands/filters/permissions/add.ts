import { Flags } from '@oclif/core';
import { FilterPermission, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { FilterPermissionsColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Add extends BaseCommand {
    static description = 'Adds a share permissions to the given filter. Adding a global permission removes all previous permissions from the filter. ' + UX.processDocumentation('<doc:FilterPermission>');
    static examples = [
        '$ jiraserver filters:permissions:add -a "MyAlias" --filter "theFilterId" --data "[{\'type\':\'group\',\'groupname\':\'jira-administrators\',\'view\':true,\'edit\':false},{\'type\':\'user\',\'userKey\':\'userKey\',\'view\':true,\'edit\':true}]" --json',
        '$ jiraserver filters:permissions:add -a "MyAlias" --filter "theFilterId" --file "path/to/the/json/data/file" --csv',
        '$ jiraserver filters:permissions:add -a "MyAlias" --filter "theFilterId" --file "path/to/the/json/data/file"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        expand: BuildFlags.expand(),
        data: BuildFlags.input.jsonData('<doc:FilterPermissionInput>'),
        file: BuildFlags.input.jsonFile('<doc:FilterPermissionInput>'),
        filter: Flags.string({
            description: 'The Filter Id to add permissions',
            required: true,
            name: 'Filter Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<FilterPermission[]>> {
        const response = new JiraCLIResponse<FilterPermission[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.filters.permissions(this.flags.filter).add(this.getJSONInputData());
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Filter Permission');
            this.ux.log(response.message);
            this.ux.table<FilterPermission>(result, FilterPermissionsColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
