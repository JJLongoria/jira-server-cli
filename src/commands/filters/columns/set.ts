import { Flags } from "@oclif/core";
import { ColumnItem, JiraServerConnector } from "jira-server-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { JiraCLIResponse } from "../../../libs/core/jiraResponse";
import { ColumnItemColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Set extends BaseCommand {
    static description = 'Sets the default columns for the given filter. ' + UX.processDocumentation('<doc:ColumnItem>');
    static examples = [
        `$ jiraserver filters:columns:set -a "MyAlias" --filter "theFilterId" --data "[{'label': 'label1', 'value':'value1'}, {'label': 'label2', 'value':'value2'}]" --json`,
        `$ jiraserver filters:columns:set -a "MyAlias" --filter "theFilterId" --file "path/to/the/json/data/file" --csv`,
        `$ jiraserver filters:columns:set -a "MyAlias" --filter "theFilterId" --file "path/to/the/json/data/file"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        data: BuildFlags.input.jsonData('<doc:ColumnItem>'),
        file: BuildFlags.input.jsonFile('<doc:ColumnItem>'),
        filter: Flags.string({
            description: 'The Filter Id to set columns',
            required: true,
            name: 'Filter Id',
        }),
    };
    async run(): Promise<JiraCLIResponse<ColumnItem[]>> {
        const response = new JiraCLIResponse<ColumnItem[]>();
        const connector = new JiraServerConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.filters.columns(this.flags.filter).set(this.getJSONInputData());
            response.result = result
            response.status = 0;
            response.message = this.getRecordUpdatedText('Columns');
            this.ux.log(response.message);
            this.ux.table<ColumnItem>(result, ColumnItemColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}