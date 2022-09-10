import { Flags } from "@oclif/core";
import { CustomField, JiraServerConnector, Page } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { CustomFieldColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Return a filtered page of Custom Fields JSON representation. ' + UX.processDocumentation('<doc:CustomField>');
    static examples = [
        `$ jiraserver fields:custom:list -a "MyAlias" --json`,
        `$ jiraserver fields:custom:list -a "MyAlias" --csv`,
        `$ jiraserver fields:custom:list -a "MyAlias" `,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        ...BuildFlags.pagination(false, true, true),
        search: Flags.string({
            description: 'The search string to filter fields',
            required: false,
            name: 'Search',
        }),
        projects: Flags.string({
            description: 'The project ids to filter fields',
            required: false,
            name: 'Project Ids',
        }),
        screens: Flags.string({
            description: 'The screen ids to filter fields',
            required: false,
            name: 'Screen Ids',
        }),
        types: Flags.string({
            description: 'The types to filter fields',
            required: false,
            name: 'Types',
        }),
    };
    async run(): Promise<JiraCLIResponse<Page<CustomField>>> {
        const response = new JiraCLIResponse<Page<CustomField>>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<CustomField> = new Page();
            if (this.flags.all) {
                let tmp = await connector.customFields.list({
                    types: this.flags.types,
                    projectId: this.flags.projects,
                    screenIds: this.flags.screens,
                    search: this.flags.search,
                    sortColumn: this.flags.column,
                    sortOrder: this.flags.order,
                    pageOptions: this.allPageOptions
                });
                result.values.push(...tmp.values);
                result.isLast = true;
                result.startAt = tmp.startAt;
                while (!tmp.isLast) {
                    tmp = await connector.customFields.list({
                        pageOptions: {
                            startAt: tmp.nextPageStart,
                            maxResults: 100,
                        }
                    });
                    result.values.push(...tmp.values);
                }
                result.maxResults = result.values.length;
            } else {
                result = await connector.customFields.list({
                    types: this.flags.types,
                    projectId: this.flags.projects,
                    screenIds: this.flags.screens,
                    search: this.flags.search,
                    sortColumn: this.flags.column,
                    sortOrder: this.flags.order,
                    pageOptions: this.pageOptions
                });
            }
            response.result = result
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Custom Field');
            this.ux.log(response.message);
            this.ux.table<CustomField>([result.values], CustomFieldColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}