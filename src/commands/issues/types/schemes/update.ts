import { Flags } from '@oclif/core';
import { IssueTypeScheme, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../libs/core/jiraResponse';
import { IssueTypeSchemeColumns } from '../../../../libs/core/tables';
import { UX } from '../../../../libs/core/ux';

export default class Update extends BaseCommand {
    static description = 'Updates the specified issue type scheme from a JSON representation. (Admin required). ' + UX.processDocumentation('<doc:IssueTypeScheme>');
    static examples = [
        '$ jiraserver issues:types:schemes:update -a "MyAlias" --scheme "theIssueTypeSchemeId" --name "theSchemeName" --description "SchemeDescription" --default "defaultIssueTypeId" --types "IssueTypeId1, IssueTypeId2" --json',
        '$ jiraserver issues:types:schemes:update -a "MyAlias" --scheme "theIssueTypeSchemeId" --name "theSchemeName" --description "SchemeDescription" --default "defaultIssueTypeId" --types "IssueTypeId1" --csv',
        '$ jiraserver issues:types:schemes:update -a "MyAlias" --scheme "theIssueTypeSchemeId" --name "theSchemeName" --description "SchemeDescription" --default "defaultIssueTypeId" --types "IssueTypeId1, IssueTypeId2, IssueTypeId3"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        scheme: Flags.string({
            description: 'The Issue Type Scheme Id to update',
            required: true,
            name: 'Issue Type Scheme Id',
        }),
        name: Flags.string({
            description: 'The Issue type Scheme name',
            required: true,
            name: 'Name',
        }),
        description: Flags.string({
            description: 'The Issue Type Scheme description',
            required: true,
            name: 'Description',
        }),
        default: Flags.string({
            description: 'The Default Issue Type',
            required: true,
            name: 'Default',
        }),
        types: BuildFlags.array({
            description: 'The Issue Type Ids',
            required: true,
            name: 'Types',
        }),
    };

    async run(): Promise<JiraCLIResponse<IssueTypeScheme>> {
        const response = new JiraCLIResponse<IssueTypeScheme>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issueTypesSchemes.update(this.flags.scheme, {
                description: this.flags.description,
                name: this.flags.name,
                defaultIssueTypeId: this.flags.default,
                issueTypeIds: this.flags.types,
            });
            response.result = result;
            response.status = 0;
            response.message = this.getRecordUpdatedText('Issue Type Scheme');
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
