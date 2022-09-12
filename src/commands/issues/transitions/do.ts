import { Flags } from '@oclif/core';
import { JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';

export default class Do extends BaseCommand {
    static description = 'Perform a transition on an issue. When performing the transition you can update or set other issue fields. The fields that can be set on transtion, in either the fields parameter or the update parameter can be determined using the issues:transitions:list command';
    static examples = [
        '$ jiraserver issues:transitions:do -a "MyAlias" --issue "theIssueKeyOrId" --data "{\'update\':{\'comment\':[{\'add\':{\'body\':\'Bug has been fixed.\'}}]},\'fields\':{\'assignee\':{\'name\':\'bob\'},\'resolution\':{\'name\':\'Fixed\'}},\'transition\':{\'id\':\'5\'},\'historyMetadata\':{\'type\':\'myplugin:type\',\'description\':\'text description\',\'descriptionKey\':\'plugin.changereason.i18.key\',\'activityDescription\':\'text description\',\'activityDescriptionKey\':\'plugin.activity.i18.key\',\'actor\':{\'id\':\'tony\',\'displayName\':\'Tony\',\'type\':\'mysystem-user\',\'avatarUrl\':\'http://mysystem/avatar/tony.jpg\',\'url\':\'http://mysystem/users/tony\'},\'generator\':{\'id\':\'mysystem-1\',\'type\':\'mysystem-application\'},\'cause\':{\'id\':\'myevent\',\'type\':\'mysystem-event\'},\'extraData\':{\'keyvalue\':\'extra data\',\'goes\':\'here\'}}}" --json',
        '$ jiraserver issues:transitions:do -a "MyAlias" --issue "theIssueKeyOrId" --file "path/to/the/json/data/file" --csv',
        '$ jiraserver issues:transitions:do -a "MyAlias" --issue "theIssueKeyOrId" --file "path/to/the/json/data/file"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        expand: BuildFlags.expand(),
        data: BuildFlags.input.jsonData('<doc:IssueInput>'),
        file: BuildFlags.input.jsonFile('<doc:IssueInput>'),
        issue: Flags.string({
            description: 'The Issue key or id to retrieve transitions',
            required: true,
            name: 'Issue Key or Id',
        }),
    };

    async run(): Promise<JiraCLIResponse<any>> {
        const response = new JiraCLIResponse<any>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.issues.transitions(this.flags.issue).execute(this.getJSONInputData(), this.flags.expand);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordUpdatedText('Issue');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
