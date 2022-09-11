import { Flags } from "@oclif/core";
import { JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";

export default class Update extends BaseCommand {
    static description = 'Edits an issue from a JSON representation. The issue can either be updated by setting explicit the field value(s) or by using an operation to change the field value. The fields that can be updated, in either the fields parameter or the update parameter, can be determined using the issues:meta:edit command.';
    static examples = [
        `$ jiraserver issues:update -a "MyAlias" --issue "theIssueKeyOrId" --data "{'update':{'worklog':[{'add':{'timeSpent':'60m','started':'2011-07-05T11:05:00.000+0000'}}]},'fields':{'project':{'id':'10000'},'summary':'something's wrong','issuetype':{'id':'10000'},'assignee':{'name':'homer'},'reporter':{'name':'smithers'},'priority':{'id':'20000'},'labels':['bugfix','blitz_test'],'timetracking':{'originalEstimate':'10','remainingEstimate':'5'},'security':{'id':'10000'},'versions':[{'id':'10000'}],'environment':'environment','description':'description','duedate':'2011-03-11','fixVersions':[{'id':'10001'}],'components':[{'id':'10000'}],'customfield_30000':['10000','10002'],'customfield_80000':{'value':'red'},'customfield_20000':'06/Jul/11 3:25 PM','customfield_40000':'this is a text field','customfield_70000':['jira-administrators','jira-software-users'],'customfield_60000':'jira-software-users','customfield_50000':'this is a text area. big text.','customfield_10000':'09/Jun/81'}}" --json`,
        `$ jiraserver issues:update -a "MyAlias" --issue "theIssueKeyOrId" --file "path/to/the/json/data/file" --csv`,
        `$ jiraserver issues:update -a "MyAlias" --issue --no-notify "theIssueKeyOrId" --file "path/to/the/json/data/file"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        data: BuildFlags.input.jsonData('<doc:IssueInput>'),
        file: BuildFlags.input.jsonFile('<doc:IssueInput>'),
        issue: Flags.string({
            description: 'The Issue key or id to update',
            required: true,
            name: 'Issue Key or Id',
        }),
        notify: Flags.boolean({
            description: 'Send the email with notification that the issue was updated to users that watch it. Admin or project admin permissions are required to disable the notification',
            required: false,
            default: true,
            name: 'Notify Users',
            allowNo: true,
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.update(this.flags.issue, this.getJSONInputData(), this.flags.notify);
            response.result = result
            response.status = 0;
            response.message = this.getRecordUpdatedText('Issue');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}