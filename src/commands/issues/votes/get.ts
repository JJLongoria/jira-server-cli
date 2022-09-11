import { Flags } from "@oclif/core";
import { IssueVotes, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { IssueVotesColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Get the votes from an issue, including voters and if the logged user vote. ' + UX.processDocumentation('<doc:IssueVotes>');
    static examples = [
        `$ jiraserver issues:votes:get -a "MyAlias" --issue "theIssueKeyOrId" --json`,
        `$ jiraserver issues:votes:get -a "MyAlias" --issue "theIssueKeyOrId" --csv`,
        `$ jiraserver issues:votes:get -a "MyAlias" --issue "theIssueKeyOrId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        issue: Flags.string({
            description: 'The Issue key or id to get votes',
            required: true,
            name: 'Issue Key or Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<IssueVotes>> {
        const response = new JiraCLIResponse<IssueVotes>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.votes(this.flags.issue).list();
            response.result = result
            response.status = 0;
            response.message = this.getRecordRetrievedText('Issue Votes');
            this.ux.log(response.message);
            this.ux.table<IssueVotes>([result], IssueVotesColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}