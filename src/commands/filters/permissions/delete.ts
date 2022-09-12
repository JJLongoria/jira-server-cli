import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';

export default class Delete extends BaseCommand {
    static description = 'Removes a share permissions from the given filter.';
    static examples = [
        '$ jiraserver filters:permissions:delete -a "MyAlias" --filter "theFilterId" --permission "thePermissionId" --json',
        '$ jiraserver filters:permissions:delete -a "MyAlias" --filter "theFilterId" --permission "thePermissionId" --csv',
        '$ jiraserver filters:permissions:delete -a "MyAlias" --filter "theFilterId" --permission "thePermissionId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        filter: Flags.string({
            description: 'The Filter Id to delete permission',
            required: true,
            name: 'Filter Id',
        }),
        permission: Flags.string({
            description: 'The Permission Id to delete',
            required: true,
            name: 'Permission Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.filters.permissions(this.flags.filter).delete(this.flags.permission);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordDeletedText('Permission');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
