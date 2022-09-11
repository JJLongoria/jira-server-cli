import { Flags } from "@oclif/core";
import { IssueTransition, IssueTransitions, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { IssueTransitionColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Get a list of the transitions possible for this issue by the current user, along with fields that are required and their types. Fields will only be returned if expand=transitions.fields. The fields in the metadata correspond to the fields in the transition screen for that transition' + UX.processDocumentation('<doc:IssueTransitions>');
    static examples = [
        `$ jiraserver issues:transitions:list -a "MyAlias" --issue "theIssueKeyOrId" --json`,
        `$ jiraserver issues:transitions:list -a "MyAlias" --issue "theIssueKeyOrId" --transition "theTransitionId" --csv`,
        `$ jiraserver issues:transitions:list -a "MyAlias" --issue "theIssueKeyOrId"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        expand: BuildFlags.expand(),
        issue: Flags.string({
            description: 'The Issue key or id to retrieve transitions',
            required: true,
            name: 'Issue Key or Id',
        }),
        transition: Flags.string({
            description: 'The transition Id to retrieve the specified transition',
            required: false,
            name: 'Transition Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<IssueTransitions>> {
        const response = new JiraCLIResponse<IssueTransitions>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.transitions(this.flags.issue).list(this.flags.link, this.flags.expand);
            response.result = result
            response.status = 0;
            response.message = this.getRecordsFoundText(result.transitions.length, 'Issue Transition');
            this.ux.log(response.message);
            this.ux.table<IssueTransition>(result.transitions, IssueTransitionColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}