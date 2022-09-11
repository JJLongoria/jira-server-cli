import { Flags } from "@oclif/core";
import { IssueRemoteLink, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../../libs/core/jiraResponse";
import { IssueRemoteLinkColumns } from "../../../../libs/core/tables";

export default class Update extends BaseCommand {
    static description = 'Updates a remote issue link from a JSON representation. Any fields not provided are set to null.';
    static examples = [
        `$ jiraserver issues:links:remote:update -a "MyAlias" --issue "theIssueKeyOrId" --link "theLinkId" --data "{'globalId':'system=http://www.mycompany.com/support&id=1','application':{'type':'com.acme.tracker','name':'My Acme Tracker'},'relationship':'causes','object':{'url':'http://www.mycompany.com/support?id=1','title':'TSTSUP-111','summary':'Crazy customer support issue','icon':{'url16x16':'http://www.mycompany.com/support/ticket.png','title':'Support Ticket'},'status':{'resolved':true,'icon':{'url16x16':'http://www.mycompany.com/support/resolved.png','title':'Case Closed','link':'http://www.mycompany.com/support?id=1&details=closed'}}}}" --json`,
        `$ jiraserver issues:links:remote:update -a "MyAlias" --issue "theIssueKeyOrId" --link "theLinkId" --file "path/to/the/json/data/file" --csv`,
        `$ jiraserver issues:links:remote:update -a "MyAlias" --issue "theIssueKeyOrId" --link "theLinkId" --file "path/to/the/json/data/file"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        data: BuildFlags.input.jsonData('<doc:IssueRemoteLink>'),
        file: BuildFlags.input.jsonFile('<doc:IssueRemoteLink>'),
        issue: Flags.string({
            description: 'The Issue key or id to update remote link',
            required: true,
            name: 'Issue Key or Id',
        }),
        link: Flags.string({
            description: 'The Link Id to update',
            required: true,
            name: 'Link Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.remoteLinks(this.flags.issue).update(this.flags.link, this.getJSONInputData());
            response.status = 0;
            response.message = this.getRecordUpdatedText('Issue Remote Link');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}