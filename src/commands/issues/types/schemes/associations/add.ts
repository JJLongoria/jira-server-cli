import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../../libs/core/jiraResponse';

export default class Add extends BaseCommand {
    static description = 'Adds additional projects to those already associated with the specified issue type scheme. (Admin required).';
    static examples = [
        '$ jiraserver issues:types:schemes:associations:add -a "MyAlias" --scheme "theIssueTypeSchemeId" --projects "project1, project2, project3" --json',
        '$ jiraserver issues:types:schemes:associations:add -a "MyAlias" --scheme "theIssueTypeSchemeId" --projects "project1" --csv',
        '$ jiraserver issues:types:schemes:associations:add -a "MyAlias" --scheme "theIssueTypeSchemeId" --projects "project1, project2"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        scheme: Flags.string({
            description: 'The Issue Type Scheme Id to associate projects',
            required: true,
            name: 'Issue Type Scheme Id',
        }),
        projects: BuildFlags.array({
            description: 'The Project Id or Keys to associate. (Comma Separated Values)',
            required: true,
            name: 'Project Keys or Ids',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueTypesSchemes.associations(this.flags.schema).create(this.flags.projects);
            response.result = result;
            response.status = 0;
            response.message = 'Issue Type Scheme Associations added successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
