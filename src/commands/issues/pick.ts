import { Flags } from "@oclif/core";
import { IssuePickerOutput, IssuePickerSection, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { IssuePickerSectionColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class Pick extends BaseCommand {
    static description = 'Returns suggested issues which match the auto-completion query for the user which executes this request. This REST method will check the user\'s history and the user\'s browsing context and select this issues, which match the query. ' + UX.processDocumentation('<doc:IssuePickerOutput>');
    static examples = [
        `$ jiraserver issues:pick -a "MyAlias" --issue "theIssueKeyOrId" --query "theQuery" --json`,
        `$ jiraserver issues:pick -a "MyAlias" --issue "theIssueKeyOrId" --jql "TheJql" --issue "theIssueKey" --subtasks-parent --csv`,
        `$ jiraserver issues:pick -a "MyAlias" --issue "theIssueKeyOrId" --project "theProjectId" --subtasks`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        expand: BuildFlags.expand(),
        query: Flags.string({
            description: 'The query to pick issues',
            required: false,
            name: 'Query',
        }),
        jql: Flags.string({
            description: 'The JQL in context of which the request is executed. Only issues which match this JQL query will be included in results',
            required: false,
            name: 'Query',
        }),
        issue: Flags.string({
            description: 'The key of the issue in context of which the request is executed. The issue which is in context will not be included in the auto-completion result, even if it matches the query',
            required: false,
            name: 'Current Issue Key',
        }),
        project: Flags.string({
            description: 'The id of the project in context of which the request is executed. Suggested issues will be only from this project.',
            required: false,
            name: 'Current Project Id',
        }),
        subtasks: Flags.boolean({
            description: 'If set to false, subtasks will not be included in the list.',
            required: false,
            name: 'Show Subtasks',
            allowNo: true,
        }),
        'subtasks-parent': Flags.boolean({
            description: 'If set to false and request is executed in context of a subtask, the parent issue will not be included in the auto-completion result, even if it matches the query.',
            required: false,
            name: 'Show Subtasks Parent',
            allowNo: true,
        }),
    };
    async run(): Promise<JiraCLIResponse<IssuePickerOutput>> {
        const response = new JiraCLIResponse<IssuePickerOutput>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.pick({
                currentIssueKey: this.flags.issue,
                currentJQL: this.flags.jql,
                currentProjectId: this.flags.project,
                query: this.flags.query,
                showSubTaskParent: this.flags['subtasks-parent'],
                showSubTasks: this.flags.subtasks,
            });
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Issue Picker Result');
            this.ux.log(response.message);
            this.ux.table<IssuePickerSection>(result.sections, IssuePickerSectionColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}