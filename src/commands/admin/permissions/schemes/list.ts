import { JiraServerConnector, PermissionScheme, PermissionSchemes } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { PermissionSchemeColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns a list of all permission schemes. By default only shortened beans are returned. If you want to include permissions of all the schemes, then specify the permissions expand parameter. Permissions will be included also if you specify any other expand parameter. ' + UX.processDocumentation('<doc:PermissionSchemes>');
    static examples = [
        '$ jiraserver admin:permissions:schemes:list -a "MyAlias" --json',
        '$ jiraserver admin:permissions:schemes:list -a "MyAlias" --csv',
        '$ jiraserver admin:permissions:schemes:list -a "MyAlias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        expand: BuildFlags.expand(),
    };

    async run(): Promise<JiraCLIResponse<PermissionSchemes>> {
        const response = new JiraCLIResponse<PermissionSchemes>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.permissionSchemes.list(this.flags.expand);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.permissionSchemes.length, 'Permission Scheme');
            this.ux.log(response.message);
            this.ux.table<PermissionScheme>(result.permissionSchemes, PermissionSchemeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
