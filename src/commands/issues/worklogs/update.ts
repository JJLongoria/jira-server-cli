import { Flags } from "@oclif/core";
import { IssueWorklog, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { IssueWorklogColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Update extends BaseCommand {
    static description = 'Updates an existing worklog entry. Fields possible for editing are: comment, visibility, started, timeSpent and timeSpentSeconds. Either timeSpent or timeSpentSeconds can be set. ' + UX.processDocumentation('<doc:IssueWorklog>');
    static examples = [
        `$ jiraserver issues:worklogs:update -a "MyAlias" --issue "theIssueKeyOrId" --worklog "theWorklogId" --data "{'comment':'I did some work here.','visibility':{'type':'group','value':'jira-developers'},'started':'2022-08-25T12:37:29.683+0000','timeSpentSeconds':12000}" --json`,
        `$ jiraserver issues:worklogs:update -a "MyAlias" --issue "theIssueKeyOrId" --worklog "theWorklogId" --adjust "new" --new "4d" --file "path/to/the/json/data/file" --csv`,
        `$ jiraserver issues:worklogs:update -a "MyAlias" --issue "theIssueKeyOrId" --worklog "theWorklogId" --file "path/to/the/json/data/file"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        data: BuildFlags.input.jsonData('<doc:IssueWorklogInput>'),
        file: BuildFlags.input.jsonFile('<doc:IssueWorklogInput>'),
        issue: Flags.string({
            description: 'The Issue key or id to update worklog',
            required: true,
            name: 'Issue Key or Id',
        }),
        worklog: Flags.string({
            description: 'The Worklog Id to update',
            required: true,
            name: 'Worklog Id',
        }),
        adjust: Flags.string({
            description: 'Allows you to provide specific instructions to update the remaining time estimate of the issue',
            required: false,
            options: ['new', 'leave', 'auto'],
            default: 'auto',
            type: "option",
            name: 'Adjust Estimate',
        }),
        new: Flags.string({
            description: 'The new value for the remaining estimate field. (e.g. "2d"). Required when "new" is selected for --adjust.',
            required: false,
            name: 'New Estimate',
            dependsOn: ['adjust']
        }),
    };
    async run(): Promise<JiraCLIResponse<IssueWorklog>> {
        const response = new JiraCLIResponse<IssueWorklog>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.worklogs(this.flags.issue).update(this.flags.worklog, this.getJSONInputData(), {
                adjustEstimate: this.flags.adjust,
                newEstimate: this.flags.new,
            });
            response.result = result;
            response.status = 0;
            response.message = this.getRecordUpdatedText('Worklog');
            this.ux.log(response.message);
            this.ux.table<IssueWorklog>([result], IssueWorklogColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,

            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}