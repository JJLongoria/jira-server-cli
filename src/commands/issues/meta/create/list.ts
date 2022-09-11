import { Flags } from "@oclif/core";
import { CreateMeta, JiraServerConnector, Page } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../../libs/core/jiraResponse";
import { CreateMetaColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Returns the metadata for issue types used for creating issues. Data will not be returned if the user does not have permission to create issues in that project. ' + UX.processDocumentation('<doc:CreateMeta>');
    static examples = [
        `$ jiraserver issues:meta:create:list -a "MyAlias" --project "theProjectKeyOrId" --json`,
        `$ jiraserver issues:meta:create:list -a "MyAlias" --project "theProjectKeyOrId" --csv`,
        `$ jiraserver issues:meta:create:list -a "MyAlias" --project "theProjectKeyOrId"`,
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
    };
    async run(): Promise<JiraCLIResponse<Page<CreateMeta>>> {
        const response = new JiraCLIResponse<Page<CreateMeta>>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<CreateMeta> = new Page();
            if (this.flags.all) {
                let tmp = await connector.issues.createMeta().list(this.flags.project, this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLast = true;
                result.startAt = tmp.startAt;
                while (!tmp.isLast) {
                    tmp = await connector.issues.createMeta().list(this.flags.project, {
                        startAt: tmp.nextPageStart,
                        maxResults: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.maxResults = result.values.length;
            } else {
                result = await connector.issues.createMeta().list(this.flags.project, this.pageOptions);
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Create Meta');
            this.ux.log(response.message);
            this.ux.table<CreateMeta>(result.values, CreateMetaColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}