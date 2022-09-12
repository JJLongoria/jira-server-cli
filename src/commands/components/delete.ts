import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../libs/core/jiraResponse';

export default class Get extends BaseCommand {
    static description = 'Delete a project component.';
    static examples = [
        '$ jiraserver components:delete -a "MyAlias" --component "theComponentId" --json',
        '$ jiraserver components:delete -a "MyAlias" --component "theComponentId" --move-to "OtherComponent" --csv',
        '$ jiraserver components:delete -a "MyAlias" --component "theComponentId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        component: Flags.string({
            description: 'The Component Id to delete',
            required: true,
            name: 'Component Id',
        }),
        'move-to': Flags.string({
            description: 'The new component applied to issues whose "id" component will be deleted. If this value is null, then the "id" component is simply removed from the related isues',
            required: false,
            name: 'Move To Component Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.components.delete(this.flags.component, this.flags['move-to']);
            response.status = 0;
            response.message = this.getRecordDeletedText('Component');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
