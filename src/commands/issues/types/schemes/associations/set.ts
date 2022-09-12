import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../../libs/core/jiraResponse';

export default class Set extends BaseCommand {
    static description = 'Associates the given projects with the specified issue type scheme. Any existing project-associations the issue type scheme has will be overwritten. (Admin required).';
    static examples = [
        '$ jiraserver issues:types:schemes:associations:set -a "MyAlias" --scheme "theIssueTypeSchemeId" --projects "project1, project2, project3" --json',
        '$ jiraserver issues:types:schemes:associations:set -a "MyAlias" --scheme "theIssueTypeSchemeId" --projects "project1" --csv',
        '$ jiraserver issues:types:schemes:associations:set -a "MyAlias" --scheme "theIssueTypeSchemeId" --projects "project1, project2"',
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
            await connector.issueTypesSchemes.associations(this.flags.schema).update(this.flags.projects);
            response.status = 0;
            response.message = this.getRecordCreatedText('Issue Type Scheme Associations');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
