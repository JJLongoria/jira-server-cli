import { Flags } from "@oclif/core";
import { IssueWorklog, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";

export default class Delete extends BaseCommand {
    static description = 'Deletes an existing worklog entry.';
    static examples = [
        `$ jiraserver issues:worklogs:delete -a "MyAlias" --issue "theIssueKeyOrId" --worklog "theWorklogId" --json`,
        `$ jiraserver issues:worklogs:delete -a "MyAlias" --issue "theIssueKeyOrId" --worklog "theWorklogId" --adjust "new" --new "3d" --csv`,
        `$ jiraserver issues:worklogs:delete -a "MyAlias" --issue "theIssueKeyOrId" --worklog "theWorklogId" --adjust "manual" --increase "2d"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        extended: BuildFlags.extended,
        issue: Flags.string({
            description: 'The Issue key or id to delete worklog',
            required: true,
            name: 'Issue Key or Id',
        }),
        worklog: Flags.string({
            description: 'The Worklog Id to delete',
            required: true,
            name: 'Worklog Id',
        }),
        adjust: Flags.string({
            description: 'Allows you to provide specific instructions to update the remaining time estimate of the issue',
            required: false,
            options: ['new', 'leave', 'manual', 'auto'],
            default: 'auto',
            type: "option",
            name: 'Adjust Estimate',
        }),
        new: Flags.string({
            description: 'The new value for the remaining estimate field. (e.g. "2d"). Required when "new" is selected for --adjust.',
            required: false,
            name: 'New Estimate',
            exclusive: ['increase'],
            dependsOn: ['adjust']
        }),
        increase: Flags.string({
            description: 'The amount to increase the remaining estimate by (e.g. "2d"). Required when "manual" is selected for --adjust',
            required: false,
            name: 'Increase By',
            exclusive: ['new'],
            dependsOn: ['adjust']
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.worklogs(this.flags.issue).delete(this.flags.worklog, {
                adjustEstimate: this.flags.adjust,
                increaseBy: this.flags.increase,
                newEstimate: this.flags.new,
            });
            response.status = 0;
            response.message = this.getRecordDeletedText('Worklog');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}