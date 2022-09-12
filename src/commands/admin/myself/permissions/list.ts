import { Flags } from '@oclif/core';
import { JiraServerConnector, UserPermission, UserPermissionsOutput } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { UserPermissionColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns all permissions in the system and whether the currently logged in user has them. You can optionally provide a specific context to get permissions for (projectKey OR projectId OR issueKey OR issueId). ' + UX.processDocumentation('<doc:UserPermissionsOutput>');
    static examples = [
        '$ jiraserver admin:permissions:list -a "MyAlias" --json',
        '$ jiraserver admin:permissions:list -a "MyAlias" --project "theProjectId" --json',
        '$ jiraserver admin:permissions:list -a "MyAlias" --project-key "theProjectKey" --csv',
        '$ jiraserver admin:permissions:list -a "MyAlias" --issue "theIssueId"',
        '$ jiraserver admin:permissions:list -a "MyAlias" --issue-key "theIssueKey"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        project: Flags.string({
            description: 'The Project Id to list permissions',
            required: false,
            name: 'Project Id',
        }),
        'project-key': Flags.string({
            description: 'The Project Key to list permissions',
            required: false,
            name: 'Project Key',
        }),
        issue: Flags.string({
            description: 'The Issue Id to list permissions',
            required: false,
            name: 'Issue Id',
        }),
        'issue-key': Flags.string({
            description: 'The Issue Key to list permissions',
            required: false,
            name: 'Issue Key',
        }),
    };

    async run(): Promise<JiraCLIResponse<UserPermissionsOutput>> {
        const response = new JiraCLIResponse<UserPermissionsOutput>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.permissions.list({
                issueId: this.flags.issue,
                issueKey: this.flags['issue-key'],
                projectId: this.flags.project,
                projectKey: this.flags['project-key'],
            });
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(Object.keys(result.permisions).length, 'User Permission');
            this.ux.log(response.message);
            this.ux.table<UserPermission>(Object.values(result.permisions), UserPermissionColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
