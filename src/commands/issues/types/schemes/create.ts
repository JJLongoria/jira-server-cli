import { Flags } from '@oclif/core';
import { IssueTypeScheme, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { IssueTypeSchemeColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class Create extends BaseCommand {
    static description = 'Creates an issue type scheme from a JSON representation. (Admin required). ' + UX.processDocumentation('<doc:IssueTypeScheme>');
    static examples = [
        '$ jiraserver issues:types:schemes:create -a "MyAlias" --name "theSchemeName" --description "SchemeDescription" --default "defaultIssueTypeId" --types "IssueTypeId1, IssueTypeId2" --json',
        '$ jiraserver issues:types:schemes:create -a "MyAlias" --name "theSchemeName" --description "SchemeDescription" --default "defaultIssueTypeId" --types "IssueTypeId1" --csv',
        '$ jiraserver issues:types:schemes:create -a "MyAlias" --name "theSchemeName" --description "SchemeDescription" --default "defaultIssueTypeId" --types "IssueTypeId1, IssueTypeId2, IssueTypeId3"',
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
        default: Flags.string({
            description: 'The Issue type name',
            required: true,
            name: 'Name',
            type: 'option',
            options: ['subtask', 'standard'],
        }),
        types: BuildFlags.array({
            description: 'The Issue type name',
            required: true,
            name: 'Name',
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueTypeScheme>> {
        const response = new JiraCLIResponse<IssueTypeScheme>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueTypesSchemes.create({
                description: this.flags.description,
                name: this.flags.name,
                defaultIssueTypeId: this.flags.default,
                issueTypeIds: this.flags.types,
            });
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Issue Type Scheme');
            this.ux.log(response.message);
            this.ux.table<IssueTypeScheme>([result], IssueTypeSchemeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
