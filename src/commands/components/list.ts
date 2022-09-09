import { Flags } from "@oclif/core";
import { Component, JiraServerConnector, Page } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { ComponentColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Returns paginated list of filtered active components. ' + UX.processDocumentation('<doc:Component>');
    static examples = [
        `$ jiraserver components:list -a "MyAlias" --query "theQuery" --all --json`,
        `$ jiraserver components:list -a "MyAlias" --projects "theProjects" --limit 50 --csv`,
        `$ jiraserver components:list -a "MyAlias" --query "theQuery" --projects "theProjects" --start 25 --limit 50`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        ...BuildFlags.pagination(),
        query: Flags.string({
            description: 'The string that components names will be matched with',
            required: false,
            name: 'Query'
        }),
        projects: Flags.string({
            description: 'The set of project ids to filter components',
            required: false,
            name: 'Project Ids'
        }),
    };
    async run(): Promise<JiraCLIResponse<Page<Component>>> {
        const response = new JiraCLIResponse<Page<Component>>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Component> = new Page();
            if (this.flags.all) {
                let tmp = await connector.components.list({
                    startAt: 0,
                    maxResults: 100,
                    projectIds: this.flags.projects,
                    query: this.flags.query,
                });
                result.values.push(...tmp.values);
                result.isLast = true;
                result.startAt = tmp.startAt;
                while (!tmp.isLast) {
                    tmp = await connector.components.list({
                        startAt: tmp.nextPageStart,
                        maxResults: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.maxResults = result.values.length;
            } else {
                result = await connector.components.list({
                    startAt: this.flags.start,
                    maxResults: this.flags.limit,
                    projectIds: this.flags.projects,
                    query: this.flags.query,
                });
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Component');
            this.ux.log(response.message);
            this.ux.table<Component>([result.values], ComponentColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}