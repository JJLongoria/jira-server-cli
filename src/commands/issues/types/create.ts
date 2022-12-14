import { Flags } from '@oclif/core';
import { IssueType, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { IssueTypeColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Create extends BaseCommand {
    static description = 'Creates an issue type from a JSON representation and adds the issue newly created issue type to the default issue type scheme. ' + UX.processDocumentation('<doc:IssueType>');
    static examples = [
        '$ jiraserver issues:types:create -a "MyAlias" --name "theIssueTypeName" --description "IssueTypeDescription" --type "standard" --json',
        '$ jiraserver issues:types:create -a "MyAlias" --name "theIssueTypeName" --description "IssueTypeDescription" --type "subtask" --csv',
        '$ jiraserver issues:types:create -a "MyAlias" --name "theIssueTypeName" --description "IssueTypeDescription" --type "standard"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        name: Flags.string({
            description: 'The Issue type name',
            required: true,
            name: 'Name',
        }),
        description: Flags.string({
            description: 'The Issue type description',
            required: true,
            name: 'Description',
        }),
        type: Flags.string({
            description: 'The Issue type name',
            required: true,
            name: 'Name',
            type: 'option',
            options: ['subtask', 'standard'],
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueType>> {
        const response = new JiraCLIResponse<IssueType>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueTypes.create({
                description: this.flags.description,
                name: this.flags.name,
                type: this.flags.type,
            });
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Issue Type');
            this.ux.log(response.message);
            this.ux.table<IssueType>([result], IssueTypeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
