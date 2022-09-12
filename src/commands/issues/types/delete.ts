import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";

export default class Get extends BaseCommand {
    static description = 'Deletes the specified issue type. If the issue type has any associated issues, these issues will be migrated to the alternative issue type specified in the parameter. You can determine the alternative issue types by calling the issues:types:alternatives:list command';
    static examples = [
        '$ jiraserver issues:types:delete -a "MyAlias" --type "theIssueTypeId" --swap "theIssueTypeIdToSwap" --json',
        '$ jiraserver issues:types:delete -a "MyAlias" --type "theIssueTypeId" --csv',
        '$ jiraserver issues:types:delete -a "MyAlias" --type "theIssueTypeId" --swap "theIssueTypeIdToSwap"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        type: BuildFlags.array({
            description: 'The Issue Type Id to retrieve',
            required: true,
            name: 'Issue Type Id',
        }),
        swap: BuildFlags.array({
            description: 'The id of an issue type to which issues associated with the removed issue type will be migrated.',
            required: false,
            name: 'Swap Issue Type Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.issueTypes.delete(this.flags.type, this.flags.swap);
            response.status = 0;
            response.message = this.getRecordRetrievedText('Issue Type');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
