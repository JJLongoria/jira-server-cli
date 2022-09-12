import { Flags } from '@oclif/core';
import { IssueWorklog, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { IssueWorklogColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Add extends BaseCommand {
    static description = 'Adds a new worklog entry to an issue. ' + UX.processDocumentation('<doc:IssueWorklog>');
    static examples = [
        '$ jiraserver issues:worklogs:add -a "MyAlias" --issue "theIssueKeyOrId" --data "{\'comment\':\'I did some work here.\',\'visibility\':{\'type\':\'group\',\'value\':\'jira-developers\'},\'started\':\'2022-08-25T12:37:29.683+0000\',\'timeSpentSeconds\':12000}" --json',
        '$ jiraserver issues:worklogs:add -a "MyAlias" --issue "theIssueKeyOrId" --adjust "new" --new "4d" --file "path/to/the/json/data/file" --csv',
        '$ jiraserver issues:worklogs:add -a "MyAlias" --issue "theIssueKeyOrId" --adjust "manual" --reduce "2d" --file "path/to/the/json/data/file"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        data: BuildFlags.input.jsonData('<doc:IssueWorklogInput>'),
        file: BuildFlags.input.jsonFile('<doc:IssueWorklogInput>'),
        issue: Flags.string({
            description: 'The Issue key or id to add worklog',
            required: true,
            name: 'Issue Key or Id',
        }),
        adjust: Flags.string({
            description: 'Allows you to provide specific instructions to update the remaining time estimate of the issue',
            required: false,
            options: ['new', 'leave', 'manual', 'auto'],
            default: 'auto',
            type: 'option',
            name: 'Adjust Estimate',
        }),
        new: Flags.string({
            description: 'The new value for the remaining estimate field. (e.g. "2d"). Required when "new" is selected for --adjust.',
            required: false,
            name: 'New Estimate',
            exclusive: ['reduce'],
            dependsOn: ['adjust'],
        }),
        reduce: Flags.string({
            description: 'The amount to reduce the remaining estimate by (e.g. "2d"). Required when "manual" is selected for --adjust',
            required: false,
            name: 'Reduce By',
            exclusive: ['new'],
            dependsOn: ['adjust'],
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueWorklog>> {
        const response = new JiraCLIResponse<IssueWorklog>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.worklogs(this.flags.issue).create(this.getJSONInputData(), {
                adjustEstimate: this.flags.adjust,
                reduceBy: this.flags.reduce,
                newEstimate: this.flags.new,
            });
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Worklog');
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
