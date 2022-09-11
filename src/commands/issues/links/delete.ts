import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";

export default class Delete extends BaseCommand {
    static description = 'Deletes an issue link with the specified id. To be able to delete an issue link you must be able to view both issues and must have the link issue permission for at least one of the issues.';
    static examples = [
        `$ jiraserver issues:links:delete -a "MyAlias" --link "theLinkId" --json`,
        `$ jiraserver issues:links:delete -a "MyAlias" --link "theLinkId" --csv`,
        `$ jiraserver issues:links:delete -a "MyAlias" --link "theLinkId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        link: Flags.string({
            description: 'The Issue Link id to delete',
            required: true,
            name: 'Link Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueLinks.delete(this.flags.link);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordDeletedText('Issue Link');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}