import { Flags } from "@oclif/core";
import { Issue, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { IssueColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Returns an issue\'s subtask list. ' + UX.processDocumentation('<doc:Issue>');
    static examples = [
        `$ jiraserver issues:subtasks:list -a "MyAlias" --issue "theIssueKeyOrId" --json`,
        `$ jiraserver issues:subtasks:list -a "MyAlias" --issue "theIssueKeyOrId" --csv`,
        `$ jiraserver issues:subtasks:list -a "MyAlias" --issue "theIssueKeyOrId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        issue: Flags.string({
            description: 'The Issue key or id to delete',
            required: true,
            name: 'Issue Key or Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<Issue[]>> {
        const response = new JiraCLIResponse<Issue[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.subtasks(this.flags.issue).list();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.length, 'Issue');
            this.ux.log(response.message);
            this.ux.table<Issue>(result, IssueColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}