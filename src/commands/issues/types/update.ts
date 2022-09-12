import { Flags } from '@oclif/core';
import { IssueType, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { IssueTypeColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Update extends BaseCommand {
    static description = 'Updates the specified issue type from a JSON representation. ' + UX.processDocumentation('<doc:IssueType>');
    static examples = [
        '$ jiraserver issues:types:update -a "MyAlias" --type "theIssueTypeId" --name "theIssueTypeName" --description "IssueTypeDescription" --avatar 1 --json',
        '$ jiraserver issues:types:update -a "MyAlias" --type "theIssueTypeId" --name "theIssueTypeName" --description "IssueTypeDescription" --csv',
        '$ jiraserver issues:types:update -a "MyAlias" --type "theIssueTypeId" --name "theIssueTypeName" --description "IssueTypeDescription"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        type: BuildFlags.array({
            description: 'The Issue Type Id to update',
            required: true,
            name: 'Issue Type Id',
        }),
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
        avatar: Flags.integer({
            description: 'The Issue Type avatar Id',
            required: false,
            name: 'Name',
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueType>> {
        const response = new JiraCLIResponse<IssueType>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueTypes.update(this.flags.type, {
                description: this.flags.description,
                name: this.flags.name,
                avatarId: this.flags.avatar,
            });
            response.result = result;
            response.status = 0;
            response.message = this.getRecordUpdatedText('Issue Type');
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
