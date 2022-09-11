import { Flags } from "@oclif/core";
import { Issue, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { IssueColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class Delete extends BaseCommand {
    static description = 'Returns a full representation of the issue for the given issue key. ' + UX.processDocumentation('<doc:Issue>') + '. See https://docs.atlassian.com/software/jira/docs/api/REST/9.2.0/#api/2/issue-getIssue to get more info about the input parameters';
    static examples = [
        `$ jiraserver issues:get -a "MyAlias" --issue "theIssueKeyOrId" --expand "renderedFields, schema" --json`,
        `$ jiraserver issues:get -a "MyAlias" --issue "theIssueKeyOrId" --fields "navigable" --properties "prop1, prop1" --csv`,
        `$ jiraserver issues:get -a "MyAlias" --issue "theIssueKeyOrId" --fields "*all,-comment" --properties "*all, -prop1"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        expand: BuildFlags.expand(),
        issue: Flags.string({
            description: 'The Issue key or id to delete',
            required: true,
            name: 'Issue Key or Id',
        }),
        fields: Flags.string({
            description: 'The list of fields to return for the issue. By default, all fields are returned',
            required: false,
            name: 'Fields',
        }),
        properties: Flags.string({
            description: 'The list of properties to return for the issue. By default no properties are returned',
            required: false,
            name: 'Properties',
        }),
        'update-history': Flags.boolean({
            description: 'If true then return the update history',
            required: false,
            name: 'Update History',
        }),
    };
    async run(): Promise<JiraCLIResponse<Issue>> {
        const response = new JiraCLIResponse<Issue>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.get(this.flags.issue, {
                expand: this.flags.expand,
                fields: this.flags.fields,
                properties: this.flags.properties,
                updateHistory: this.flags['update-history'],
            });
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Issue');
            this.ux.log(response.message);
            this.ux.table<Issue>([result], IssueColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}