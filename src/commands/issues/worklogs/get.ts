import { Flags } from "@oclif/core";
import { IssueWorklog, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { UX } from "../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Returns a specific worklog. Note: The work log won\'t be returned if the Log work field is hidden for the project. ' + UX.processDocumentation('<doc:IssueWorklog>');
    static examples = [
        `$ jiraserver issues:worklogs:get -a "MyAlias" --issue "theIssueKeyOrId" --worklog "theWorklogId" --json`,
        `$ jiraserver issues:worklogs:get -a "MyAlias" --issue "theIssueKeyOrId" --worklog "theWorklogId" --csv`,
        `$ jiraserver issues:worklogs:get -a "MyAlias" --issue "theIssueKeyOrId" --worklog "theWorklogId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        issue: Flags.string({
            description: 'The Issue key or id to add worklog',
            required: true,
            name: 'Issue Key or Id',
        }),
        worklog: Flags.string({
            description: 'The Worklog Id to retrieve',
            required: true,
            name: 'Worklog Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<IssueWorklog>> {
        const response = new JiraCLIResponse<IssueWorklog>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.worklogs(this.flags.issue).get(this.flags.worklog);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Worklog');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}