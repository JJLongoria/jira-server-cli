import { JiraServerConnector, Permission, PermissionsOutput } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { PermissionColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns all permissions that are present in the Jira instance - Global, Project and the global ones added by plugins. ' + UX.processDocumentation('<doc:PermissionsOutput>');
    static examples = [
        '$ jiraserver admin:permissions:list -a "MyAlias" --json',
        '$ jiraserver admin:permissions:list -a "MyAlias" --csv',
        '$ jiraserver admin:permissions:list -a "MyAlias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
    };

    async run(): Promise<JiraCLIResponse<PermissionsOutput>> {
        const response = new JiraCLIResponse<PermissionsOutput>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.permissions.listAll();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(Object.keys(result.permisions).length, 'Permission');
            this.ux.log(response.message);
            this.ux.table<Permission>(Object.values(result.permisions), PermissionColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
