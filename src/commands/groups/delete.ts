import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";

export default class Create extends BaseCommand {
    static description = 'Deletes a group by given group parameter. ';
    static examples = [
        `$ jiraserver groups:create -a "MyAlias" --name "theGroupName" --json`,
        `$ jiraserver groups:create -a "MyAlias" --name "theGroupName" --swap "anotherGroupName" --csv`,
        `$ jiraserver groups:create -a "MyAlias" --name "theGroupName"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        name: Flags.string({
            description: 'The group name to delete',
            required: true,
            name: 'Name',
        }),
        swap: Flags.string({
            description: 'If you delete a group and content is restricted to that group, the content will be hidden from all users. To prevent this, use this parameter to specify a different group to transfer the restrictions (comments and worklogs only) to.',
            required: false,
            name: 'Swap',
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.groups.delete(this.flags.name, this.flags.swap);
            response.result = result
            response.status = 0;
            response.message = this.getRecordDeletedText('Group');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}