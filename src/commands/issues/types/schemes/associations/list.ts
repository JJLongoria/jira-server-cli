import { Flags } from "@oclif/core";
import { JiraServerConnector, Project } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../../../libs/core/jiraResponse";
import { UX } from "../../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'For the specified issue type scheme, returns all of the associated projects. (Admin required). ' + UX.processDocumentation('<doc:Project>');
    static examples = [
        '$ jiraserver issues:types:schemes:associations:list -a "MyAlias" --scheme "theIssueTypeSchemeId" --json',
        '$ jiraserver issues:types:schemes:associations:list -a "MyAlias" --scheme "theIssueTypeSchemeId" --csv',
        '$ jiraserver issues:types:schemes:associations:list -a "MyAlias" --scheme "theIssueTypeSchemeId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        expand: BuildFlags.expand(),
        scheme: Flags.string({
            description: 'The Issue Type Scheme Id retrieve associate projects',
            required: true,
            name: 'Issue Type Scheme Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<Project[]>> {
        const response = new JiraCLIResponse<Project[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueTypesSchemes.associations(this.flags.schema).list(this.flags.expand);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.length, 'Project');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
