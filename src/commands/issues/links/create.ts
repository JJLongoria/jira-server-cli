import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';

export default class Create extends BaseCommand {
    static description = 'Creates an issue link between two issues. The user requires the link issue permission for the issue which will be linked to another issue.';
    static examples = [
        '$ jiraserver issues:links:create -a "MyAlias" --data "{\'type\':{\'name\':\'Duplicate\'},\'inwardIssue\':{\'key\':\'HSP-1\'},\'outwardIssue\':{\'key\':\'MKY-1\'},\'comment\':{\'body\':\'Linked related issue!\',\'visibility\':{\'type\':\'group\',\'value\':\'jira-software-users\'}}}" --json',
        '$ jiraserver issues:links:create -a "MyAlias" --file "path/to/the/json/data/file"',
        '$ jiraserver issues:links:create -a "MyAlias" --inward "theInwarIssue" --outward "theOutwardIssue"',
        '$ jiraserver issues:links:create -a "MyAlias" --inward "theInwarIssue" --outward "theOutwardIssue" --comment "Comment Body" --visibility "role" --value "roleName" --json',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:LinkIssueRequest>', false, ['inward', 'outward']),
        file: BuildFlags.input.jsonFile('<doc:LinkIssueRequest>', false, ['inward', 'outward']),
        inward: Flags.string({
            description: 'The Inward Issue key or id to link',
            required: false,
            name: 'Inward Issue Key or Id',
            exclusive: ['data', 'file'],
            dependsOn: ['outward'],
        }),
        outward: Flags.string({
            description: 'The Outward Issue key or id to link',
            required: false,
            name: 'Outward Issue Key or Id',
            exclusive: ['data', 'file'],
            dependsOn: ['inward'],
        }),
        comment: Flags.string({
            description: 'The comment body',
            required: false,
            name: 'Comment Body',
            exclusive: ['data', 'file'],
            dependsOn: ['value', 'type', 'inward', 'outward'],
        }),
        type: Flags.string({
            description: 'The comment visibility type',
            required: false,
            name: 'Visibility Type',
            options: ['role', 'group'],
            type: 'option',
            exclusive: ['data', 'file'],
            dependsOn: ['body', 'value', 'inward', 'outward'],
        }),
        value: Flags.string({
            description: 'The comment visibility value',
            required: false,
            name: 'Visibility Value',
            exclusive: ['data', 'file'],
            dependsOn: ['body', 'type', 'inward', 'outward'],
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.remoteLinks(this.flags.issue).upsert(this.getJSONInputData());
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Issue Link');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
