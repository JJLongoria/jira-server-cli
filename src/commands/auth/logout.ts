import { BaseCommand, BuildFlags } from '../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../libs/core/jiraResponse';
import { InstanceColumns } from '../../libs/core/tables';
import { Instance } from '../../libs/types';

export default class Logout extends BaseCommand {
    static loginRequired = false;
    static description = 'Logout againts Jira instance.';
    static examples = [
        '$ jiraserver auth:logout -a "Alias" --json',
        '$ jiraserver auth:logout -a "Alias"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
    };

    async run(): Promise<JiraCLIResponse<Instance>> {
        const { alias, csv } = this.flags;
        const response = new JiraCLIResponse<Instance>();
        if (this.localConfig.instances && this.localConfig.instances[alias]) {
            delete this.localConfig.instances[alias];
        }

        this.localConfig.save();
        const message = 'Instace with alias ' + alias + ' logout successfully';
        response.status = 0;
        response.message = message;
        response.result = this.localConfig.instances[alias];
        this.ux.table<Instance>([response.result], InstanceColumns, {
            csv: csv,
        });
        return response;
    }
}
