import { Flags } from "@oclif/core";
import { Avatar, JiraServerConnector, SystemAvatars } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { AvatarColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Returns all system avatars of the given type. ' + UX.processDocumentation('<doc:SystemAvatars>');
    static examples = [
        `$ jiraserver avatars:list -a "MyAlias" --type "avatarType" --json`,
        `$ jiraserver avatars:list -a "MyAlias" --type "avatarType" --csv`,
        `$ jiraserver avatars:list -a "MyAlias" --type "avatarType"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        type: Flags.string({
            description: 'The Avatars type',
            required: true,
            name: 'Avatars Type'
        }),
        width: Flags.string({
            description: 'The desired width',
            required: false,
            name: 'Avatars Width'
        }),
    };
    async run(): Promise<JiraCLIResponse<SystemAvatars>> {
        const response = new JiraCLIResponse<SystemAvatars>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.avatar.list(this.flags.type, this.flags.width);
            response.result = result
            response.status = 0;
            response.message = this.getRecordsFoundText(Object.keys(result.system).length, 'Avatar');
            this.ux.log(response.message);
            this.ux.table<Avatar>([result.system], AvatarColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}