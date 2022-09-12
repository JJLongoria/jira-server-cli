import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../../libs/core/jiraResponse';

export default class Delete extends BaseCommand {
    static description = 'For the specified issue type scheme, removes the given project association . This project reverts to an association with the default/global issue type scheme.(Admin required).';
    static examples = [
        '$ jiraserver issues:types:schemes:associations:delete -a "MyAlias" --scheme "theIssueTypeSchemeId" --project "project1" --json',
        '$ jiraserver issues:types:schemes:associations:delete -a "MyAlias" --scheme "theIssueTypeSchemeId" --all --csv',
        '$ jiraserver issues:types:schemes:associations:delete -a "MyAlias" --scheme "theIssueTypeSchemeId" --project "project1"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        scheme: Flags.string({
            description: 'The Issue Type Scheme Id to delete associate projects',
            required: true,
            name: 'Issue Type Scheme Id',
        }),
        project: Flags.string({
            description: 'The Project Id or Key to remove delete association',
            required: true,
            name: 'Project Id or Key',
            exclusive: ['all'],
        }),
        all: Flags.boolean({
            description: 'Removes all project associations for the specified issue type scheme. These projects revert to an association with the default/global issue type scheme',
            required: false,
            name: 'All',
            exclusive: ['project'],
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            this.flags.all ? await connector.issueTypesSchemes.associations(this.flags.schema).deleteAll() : await connector.issueTypesSchemes.associations(this.flags.schema).delete(this.flags.project);
            response.status = 0;
            response.message = this.flags.all ? this.getRecordDeletedText('Issue Type Scheme Associations') : this.getRecordDeletedText('Issue Type Scheme Association');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
