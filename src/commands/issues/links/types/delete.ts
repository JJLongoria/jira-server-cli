import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../../libs/core/jiraResponse";

export default class Delete extends BaseCommand {
    static description = 'Delete the specified issue link type.';
    static examples = [
        `$ jiraserver issues:links:types:delete -a "MyAlias" --type "theIssueLinkTypeId" --json`,
        `$ jiraserver issues:links:types:delete -a "MyAlias" --type "theIssueLinkTypeId" --csv`,
        `$ jiraserver issues:links:types:delete -a "MyAlias" --type "theIssueLinkTypeId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        type: Flags.string({
            description: 'The Issue Link Type Id to delete',
            required: true,
            name: 'Issue Link Type',
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueLinks.types().delete(this.flags.type);
            response.status = 0;
            response.message = this.getRecordDeletedText('Issue Link Type');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}