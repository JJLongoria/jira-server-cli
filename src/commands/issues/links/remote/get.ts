import { Flags } from "@oclif/core";
import { IssueRemoteLink, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../../libs/core/jiraResponse";
import { IssueRemoteLinkColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Get the remote issue link with the given id on the issue. ' + UX.processDocumentation('<doc:IssueRemoteLink>');
    static examples = [
        `$ jiraserver issues:links:remote:get -a "MyAlias" --issue "theIssueKeyOrId" --link "theLinkId" --json`,
        `$ jiraserver issues:links:remote:get -a "MyAlias" --issue "theIssueKeyOrId" --link "theLinkId" --csv`,
        `$ jiraserver issues:links:remote:get -a "MyAlias" --issue "theIssueKeyOrId" --link "theLinkId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        issue: Flags.string({
            description: 'The Issue key or id to retrieve remote link',
            required: true,
            name: 'Issue Key or Id',
        }),
        link: Flags.string({
            description: 'The Link Id to retrieve',
            required: true,
            name: 'Link Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<IssueRemoteLink>> {
        const response = new JiraCLIResponse<IssueRemoteLink>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.remoteLinks(this.flags.issue).get(this.flags.link);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Issue Remote Link');
            this.ux.log(response.message);
            this.ux.table<IssueRemoteLink>([result], IssueRemoteLinkColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}