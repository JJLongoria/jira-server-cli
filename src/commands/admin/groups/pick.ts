import { Flags } from '@oclif/core';
import { GroupSuggestion, GroupSuggestions, JiraServerConnector } from 'jira-server-connector';
import { BaseCommand, BuildFlags } from '../../../libs/core/baseCommand';
import { JiraCLIResponse } from '../../../libs/core/jiraResponse';
import { GroupSuggestionColumns } from '../../../libs/core/tables';
import { UX } from '../../../libs/core/ux';

export default class Pick extends BaseCommand {
    static description = 'Returns groups with substrings matching a given query. This is mainly for use with the group picker, so the returned groups contain html to be used as picker suggestions. The groups are also wrapped in a single response object that also contains a header for use in the picker, specifically Showing X of Y matching groups. ' + UX.processDocumentation('<doc:GroupSuggestions>');
    static examples = [
        '$ jiraserver groups:pick -a "MyAlias" --query "theGroupName" --limit 50 --json',
        '$ jiraserver groups:pick -a "MyAlias" --query "theGroupName" --inactive --csv',
        '$ jiraserver groups:pick -a "MyAlias" --query "theGroupName" --user "theUsername"',
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        limit: Flags.integer({
            description: 'Indicates how many results will be returned',
            required: false,
            name: 'Limit',
            char: 'l',
            exclusive: [],
            default: 25,
        }),
        exclude: Flags.string({
            description: 'Exclude options',
            required: false,
            name: 'Exclude',
        }),
        query: Flags.string({
            description: 'A String to match groups agains',
            required: true,
            name: 'Query',
        }),
        user: Flags.string({
            description: 'The user to find groups',
            required: false,
            name: 'User',
        }),
    };

    async run(): Promise<JiraCLIResponse<GroupSuggestions>> {
        const response = new JiraCLIResponse<GroupSuggestions>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.groups.pick({
                maxResults: this.flags.limit,
                query: this.flags.query,
                exclude: this.flags.exclude,
                userName: this.flags.user,
            });
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.total, 'Group');
            this.ux.log(response.message);
            this.ux.table<GroupSuggestion>([result], GroupSuggestionColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }

        return response;
    }
}
