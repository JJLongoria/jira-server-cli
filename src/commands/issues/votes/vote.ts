import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";

export default class Vote extends BaseCommand {
    static description = 'Cast your vote in favour of an issue.';
    static examples = [
        `$ jiraserver issues:votes:vote -a "MyAlias" --issue "theIssueKeyOrId" --json`,
        `$ jiraserver issues:votes:vote -a "MyAlias" --issue "theIssueKeyOrId" --csv`,
        `$ jiraserver issues:votes:vote -a "MyAlias" --issue "theIssueKeyOrId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        issue: Flags.string({
            description: 'The Issue key or id to vote',
            required: true,
            name: 'Issue Key or Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.votes(this.flags.issue).vote();
            response.status = 0;
            response.message = 'Issue voted successffully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}