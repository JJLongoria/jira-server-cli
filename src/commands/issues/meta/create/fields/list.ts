import { Flags } from '@oclif/core';
import { FieldMeta, JiraServerConnector, Page } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../../../libs/core/jiraResponse';
import { FieldMetaColumns } from '../../../../../libs/core/tables';
import { UX } from '../../../../../libs/core/ux';

export default class List extends BaseCommand {
    static description = 'Returns the metadata for issue types used for creating issues. Data will not be returned if the user does not have permission to create issues in that project. ' + UX.processDocumentation('<doc:FieldMeta>');
    static examples = [
        '$ jiraserver issues:meta:create:fields:list -a "MyAlias" --project "theProjectKeyOrId" --json',
        '$ jiraserver issues:meta:create:fields:list -a "MyAlias" --project "theProjectKeyOrId" --csv',
        '$ jiraserver issues:meta:create:fields:list -a "MyAlias" --project "theProjectKeyOrId"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        ...BuildFlags.pagination(),
        project: Flags.string({
            description: 'The Project key or id to get create meta data',
            required: true,
            name: 'Project Key or Id',
        }),
        type: Flags.string({
            description: 'The issue type to get fields meta information',
            required: true,
            name: 'Issue Type Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<Page<FieldMeta>>> {
        const response = new JiraCLIResponse<Page<FieldMeta>>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<FieldMeta> = new Page();
            if (this.flags.all) {
                let tmp = await connector.issues.createMeta().listFields(this.flags.project, this.flags.type, this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLast = true;
                result.startAt = tmp.startAt;
                while (!tmp.isLast) {
                    tmp = await connector.issues.createMeta().listFields(this.flags.project, this.flags.type, {
                        startAt: tmp.nextPageStart,
                        maxResults: 100,
                    });
                    result.values.push(...tmp.values);
                }

                result.maxResults = result.values.length;
            } else {
                result = await connector.issues.createMeta().listFields(this.flags.project, this.flags.type, this.pageOptions);
            }

            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Create Meta');
            this.ux.log(response.message);
            this.ux.table<FieldMeta>(result.values, FieldMetaColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
