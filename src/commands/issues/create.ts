import { Flags } from "@oclif/core";
import { IssueLink, IssueLinks, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../libs/core/jiraResponse";
import { IssueLinkColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class Create extends BaseCommand {
    static description = 'Creates an issue or a sub-task from a JSON representation. The fields that can be set on create, in either the fields parameter or the update parameter can be determined using the issues:meta:create command. ' + UX.processDocumentation('<doc:IssueLink>');
    static examples = [
        `$ jiraserver issues:create -a "MyAlias" --data "{'update':{'worklog':[{'add':{'timeSpent':'60m','started':'2011-07-05T11:05:00.000+0000'}}]},'fields':{'project':{'id':'10000'},'summary':'something's wrong','issuetype':{'id':'10000'},'assignee':{'name':'homer'},'reporter':{'name':'smithers'},'priority':{'id':'20000'},'labels':['bugfix','blitz_test'],'timetracking':{'originalEstimate':'10','remainingEstimate':'5'},'security':{'id':'10000'},'versions':[{'id':'10000'}],'environment':'environment','description':'description','duedate':'2011-03-11','fixVersions':[{'id':'10001'}],'components':[{'id':'10000'}],'customfield_30000':['10000','10002'],'customfield_80000':{'value':'red'},'customfield_20000':'06/Jul/11 3:25 PM','customfield_40000':'this is a text field','customfield_70000':['jira-administrators','jira-software-users'],'customfield_60000':'jira-software-users','customfield_50000':'this is a text area. big text.','customfield_10000':'09/Jun/81'}}" --json`,
        `$ jiraserver issues:create -a "MyAlias" --bulk --data "[{'update':{'worklog':[{'add':{'timeSpent':'60m','started':'2011-07-05T11:05:00.000+0000'}}]},'fields':{'project':{'id':'10000'},'summary':'something's wrong','issuetype':{'id':'10000'},'assignee':{'name':'homer'},'reporter':{'name':'smithers'},'priority':{'id':'20000'},'labels':['bugfix','blitz_test'],'timetracking':{'originalEstimate':'10','remainingEstimate':'5'},'security':{'id':'10000'},'versions':[{'id':'10000'}],'environment':'environment','description':'description','duedate':'2011-03-11','fixVersions':[{'id':'10001'}],'components':[{'id':'10000'}],'customfield_30000':['10000','10002'],'customfield_80000':{'value':'red'},'customfield_20000':'06/Jul/11 3:25 PM','customfield_40000':'this is a text field','customfield_70000':['jira-administrators','jira-software-users'],'customfield_60000':'jira-software-users','customfield_50000':'this is a text area. big text.','customfield_10000':'09/Jun/81'}}, { ... }]" --json`,
        `$ jiraserver issues:create -a "MyAlias" --file "path/to/the/json/data/file" --csv`,
        `$ jiraserver issues:create -a "MyAlias" --bulk --file "path/to/the/json/data/file"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        data: BuildFlags.input.jsonData('<doc:IssueInput>'),
        file: BuildFlags.input.jsonFile('<doc:IssueInput>'),
        bulk: Flags.boolean({
            description: 'Create issues in bulk, this expect and array of IssueInput as data (instead a single IssueInput). With this options, return an IssueLinks response (instead single issue link)' + UX.processDocumentation('<doc:IssueLinks>'),
            required: true,
            name: 'Update History',
        }),
        'update-history': Flags.boolean({
            description: 'If true then the user\'s project history is updated',
            required: false,
            name: 'Update History',
            exclusive: ['bulk'],
        }),
    };
    async run(): Promise<JiraCLIResponse<IssueLink | IssueLinks>> {
        const response = new JiraCLIResponse<IssueLink | IssueLinks>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = this.flags.bulk ? await connector.issues.createBulk(this.getJSONInputData()) : await connector.issues.create(this.getJSONInputData(), this.flags['update-history']);
            response.result = result
            response.status = 0;
            response.message = this.getRecordCreatedText('Issue(s)');
            this.ux.log(response.message);
            if (this.flags.bulk) {
                const tmp = result as IssueLinks;
                this.ux.table<IssueLink>(tmp.issues, IssueLinkColumns, {
                    csv: this.flags.csv,
                });
            } else {
                this.ux.table<IssueLink>([result], IssueLinkColumns, {
                    csv: this.flags.csv,
                });
            }
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}