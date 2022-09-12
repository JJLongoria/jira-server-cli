import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';

export default class Delete extends BaseCommand {
    static description = 'Delete the remote issue link with the given global id on the issue.';
    static examples = [
        '$ jiraserver issues:links:remote:delete -a "MyAlias" --issue "theIssueKeyOrId" --global --link "theLinkGlobalId" --json',
        '$ jiraserver issues:links:remote:delete -a "MyAlias" --issue "theIssueKeyOrId" --link "theLinkId" --csv',
        '$ jiraserver issues:links:remote:delete -a "MyAlias" --issue "theIssueKeyOrId" --link "theLinkId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        issue: Flags.string({
            description: 'The Issue key or id to upsert remote link',
            required: true,
            name: 'Issue Key or Id',
        }),
        link: Flags.string({
            description: 'The Link Global Id or Link Id to delete',
            required: true,
            name: 'Link Id',
        }),
        global: Flags.boolean({
            description: 'True if the link passes is a Link Global Id',
            required: false,
            name: 'Is Global',
            dependsOn: ['link'],
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = this.flags.global ? await connector.issues.remoteLinks(this.flags.issue).deleteByGlobalId(this.flags.link) : await connector.issues.remoteLinks(this.flags.issue).delete(this.flags.link);
            response.status = 0;
            response.message = this.getRecordDeletedText('Issue Remote Link');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
