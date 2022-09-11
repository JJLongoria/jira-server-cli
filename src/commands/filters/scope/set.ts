import { Flags } from "@oclif/core";
import { JiraServerConnector, ShareScope } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { ShareScopeColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Set extends BaseCommand {
    static description = 'Sets the default share scope of the logged-in user. ' + UX.processDocumentation('<doc:ShareScope>');
    static examples = [
        `$ jiraserver filters:scope:set -a "MyAlias" --scope "AUTHENTICATED" --json`,
        `$ jiraserver filters:scope:set -a "MyAlias" --scope "PRIVATE" --csv`,
        `$ jiraserver filters:scope:set -a "MyAlias" --scope "PRIVATE"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        scope: Flags.string({
            description: 'The Share Scope to set',
            required: true,
            options: ['AUTHENTICATED', 'PRIVATE'],
            type: "option",
            name: 'Scope',
        }),
    };
    async run(): Promise<JiraCLIResponse<ShareScope>> {
        const response = new JiraCLIResponse<ShareScope>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.filters.defaultShareScope().set({
                scope: this.flags.scope,
            });
            response.result = result
            response.status = 0;
            response.message = this.getRecordUpdatedText('Share Scope');
            this.ux.log(response.message);
            this.ux.table<ShareScope>([result], ShareScopeColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}