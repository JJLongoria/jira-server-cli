import { Command, Flags } from "@oclif/core";
import { AlphabetLowercase, AlphabetUppercase, OptionFlag, OutputArgs, OutputFlags } from "@oclif/core/lib/interfaces";
import { PageOptions, JiraError } from "jira-server-connector";
import { FileReader } from "../fileSystem";
import { Config } from "./config";
import { JiraCLIResponse } from "./jiraResponse";
import { UX } from "./ux";

export class BuildFlags {

    static async parseArray(str: string) {
        if (!str || str.length === 0) {
            return [];
        }
        const regex = new RegExp(`"(.*?)"|\'(.*?)\'|,`);
        return str.split(regex).filter((i) => !!i).map((i) => i.trim());
    }
    static async parseKeyValue(str: string) {
        const obj: any = {};
        const keyValueRegexp = new RegExp(`"(.*?)"|\'(.*?)\'|=`);
        const arrayValues = await BuildFlags.parseArray(str);
        for (const value of arrayValues) {
            const keyValuePair = value.split(keyValueRegexp).filter((i) => !!i).map((i) => i.trim());
            obj[keyValuePair[0]] = keyValuePair[1];
        }
        return obj;
    }
    static alias = Flags.string({
        description: 'The Jira instance alias to identify user and instance to connect with',
        required: true,
        char: 'a',
        name: 'Alias'
    });
    static csv = Flags.boolean({
        description: 'Format output as CSV format',
        required: false,
        name: 'CSV',
        exclusive: ['json']
    });
    static array = (options: Partial<OptionFlag<string>>) => {
        options.parse = (input): any => {
            return BuildFlags.parseArray(input);
        }
        return Flags.string(options);
    }
    static extended = Flags.boolean({ char: 'x', description: 'Show extra columns when format output as table. (Format by default)', name: 'Extended' });
    static filter = (description: string) => {
        return Flags.string({
            description: description,
            required: false,
            name: 'Filter'
        });
    };
    static context = (description: string) => {
        return Flags.string({
            description: description,
            required: false,
            name: 'Context'
        });
    };
    static input = {
        keyvalue: (doc: string, required?: boolean, exclusive?: string[]) => {
            const exclusives = ['file', 'data'];
            if (exclusive && exclusive.length) {
                exclusives.push(...exclusive);
            }
            return Flags.string({
                description: 'Key-Value pair data. (key1=value1,key2=value2...). ' + (exclusives && exclusives.length ? UX.cannotUseWith(exclusives) + '. ' : '') + UX.processDocumentation(doc),
                required: required,
                name: 'Keyvalue',
                char: 'k',
                exclusive: exclusives,
                parse: (input, context) => {
                    return BuildFlags.parseKeyValue(input);
                }
            });
        },
        jsonData: (doc: string, required?: boolean, exclusive?: string[]) => {
            const exclusives = ['file', 'keyvalue'];
            if (exclusive && exclusive.length) {
                exclusives.push(...exclusive);
            }
            return Flags.string({
                description: 'JSON Input data. ' + (exclusives && exclusives.length ? UX.cannotUseWith(exclusives) + '. ' : '') + UX.processDocumentation(doc),
                required: required,
                name: 'Data',
                char: 'd',
                exclusive: exclusives,
                parse: (input, context) => {
                    return eval('(' + input + ')');
                }
            });
        },
        data: (doc: string, required?: boolean, exclusive?: string[]) => {
            const exclusives = ['file', 'keyvalue'];
            if (exclusive && exclusive.length) {
                exclusives.push(...exclusive);
            }
            return Flags.string({
                description: 'Input data. ' + (exclusives && exclusives.length ? UX.cannotUseWith(exclusives) + '. ' : '') + UX.processDocumentation(doc),
                required: required,
                name: 'Data',
                char: 'd',
                exclusive: exclusives,
            });
        },
        jsonFile: (doc: string, required?: boolean, exclusive?: string[]) => {
            const exclusives = ['data', 'keyvalue'];
            if (exclusive && exclusive.length) {
                exclusives.push(...exclusive);
            }
            return Flags.file({
                description: 'JSON Input data file path. ' + (exclusives && exclusives.length ? UX.cannotUseWith(exclusives) + '. ' : '') + UX.processDocumentation(doc),
                required: required,
                exclusive: exclusives,
                name: 'File',
                char: 'f'
            });
        },
        file: (doc: string, required?: boolean, exclusive?: string[]) => {
            const exclusives = ['data', 'keyvalue'];
            if (exclusive && exclusive.length) {
                exclusives.push(...exclusive);
            }
            return Flags.file({
                description: 'Input data file path. ' + (exclusives && exclusives.length ? UX.cannotUseWith(exclusives) + '. ' : '') + UX.processDocumentation(doc),
                required: required,
                exclusive: exclusives,
                name: 'File',
                char: 'f'
            });
        },

    }
    static output = {
        file: (doc: string, required?: boolean, exclusive?: string[]) => {
            return Flags.file({
                description: 'Output file path. ' + (exclusive && exclusive.length ? UX.cannotUseWith(exclusive) + '. ' : '') + UX.processDocumentation(doc),
                required: required,
                exclusive: exclusive,
                name: 'Output File',
            });
        },
        folder: (doc: string, required?: boolean, exclusive?: string[]) => {
            return Flags.directory({
                description: 'Output folder path. ' + (exclusive && exclusive.length ? UX.cannotUseWith(exclusive) + '. ' : '') + UX.processDocumentation(doc),
                required: required,
                exclusive: exclusive,
                name: 'Output Folder',
            });
        },
    }
    static expand = (description?: string) => {
        return Flags.string({
            description: description || 'Extra parameters to expand',
            required: false,
            name: 'Expand',
            char: 'e',
            exclusive: [],
        });
    }
    static pagination = (allowExpand?: boolean, allowOrder?: boolean, allowColumn?: boolean) => {
        const flags: any = {
            all: Flags.boolean({
                description: 'Return all records on the same page (instead paginate results)',
                required: false,
                name: 'All',
                exclusive: ['limit'],
                default: false,
            }),
            limit: Flags.integer({
                description: 'Indicates how many results to return per page',
                required: false,
                name: 'Limit',
                char: 'l',
                exclusive: [],
                default: 25,
            }),
            start: Flags.integer({
                description: 'Indicates which item should be used as the first item in the page of results',
                required: false,
                name: 'Start',
                char: 's',
                exclusive: [],
                default: 0,
            }),
        }
        if (allowExpand) {
            flags.expand = Flags.string({
                description: 'Extra parameters to expand',
                required: false,
                name: 'Expand',
                char: 'e',
                exclusive: [],
            });
        }
        if (allowOrder && !allowColumn) {
            flags.order = Flags.string({
                description: 'Ordering can be ascending or descending. By default it\'s ascending. To specify the ordering use "-" or "+" sign. Examples: --order "+name"; --order "name"; --order "-name"',
                required: false,
                name: 'Order By',
                char: 'o',
                exclusive: [],
            });
        } else if (allowOrder && allowColumn) {
            flags.order = Flags.string({
                description: 'The results order',
                required: false,
                name: 'Order By',
                char: 'o',
                exclusive: [],
            });
        }
        if (allowColumn) {
            flags.column = Flags.string({
                description: 'The column to order results',
                required: false,
                name: 'Order Column',
                char: 'c',
                exclusive: [],
            });
        }
        return flags;
    };
}

export class BaseCommand extends Command {


    protected localConfig: Config = new Config(this.config.dataDir);
    protected flags!: OutputFlags<any>;
    protected args!: OutputArgs;
    static flags: OutputFlags<any> = {
        loglevel: Flags.string({
            description: 'The logging level for this command execution',
            type: "option",
            options: ['error', 'warn', 'info', 'debug'],
        }),
    }
    static loginRequired = true;
    static enableJsonFlag = true;
    protected ux = new UX();

    protected get statics(): typeof BaseCommand {
        return this.constructor as typeof BaseCommand;
    }

    get pageOptions(): PageOptions | undefined {
        if (!this.flags.all) {
            return {
                maxResults: this.flags.limit,
                startAt: this.flags.start,
            }
        }
        return undefined;
    }

    get allPageOptions(): PageOptions | undefined {
        if (this.flags.all) {
            return {
                maxResults: 100,
                startAt: this.flags.start,
            }
        }
        return undefined;
    }

    validateRequiredAndExclusives(flagsConfig: OutputFlags<any>) {
        for (const flagName of Object.keys(flagsConfig)) {
            if (flagName === 'csv' || flagName === 'json')
                continue;
            const flagConfig = flagsConfig[flagName];
            if (!this.flags[flagName] && flagConfig.exclusive && flagConfig.exclusive.length) {
                let nExclusives = 0;
                let flags = ['--' + flagName];
                for (const exclusive of flagConfig.exclusive) {
                    if (this.flags[exclusive]) {
                        nExclusives++;
                    } else {
                        flags.push('--' + exclusive);
                    }
                }
                if (nExclusives === 0) {
                    throw new Error('Missing Required flags. Must indicate at least one of the following: ' + flags.join(', '));
                }
            }
        }
    }

    hasInputData() {
        return this.flags.data || this.flags.file || this.flags.keyvalue;
    }

    getJSONInputData() {
        return this.flags.data || (this.flags.file ? JSON.parse(FileReader.readFileSync(this.flags.file)) : undefined) || this.flags.keyvalue;
    }

    getInputData() {
        return this.flags.data || (this.flags.file ? FileReader.readFileSync(this.flags.file) : undefined);
    }

    parseArray(str: string): string[] {
        const regex = new RegExp(`"(.*?)"|\'(.*?)\'|,`);
        return str
            .split(regex)
            .filter((i) => !!i)
            .map((i) => i.trim());
    }

    getRecordsFoundText(recordSize: number, recordName: string) {
        if (recordSize > 0) {
            return recordSize + ' ' + recordName + ' records found';
        } else {
            return 'Not ' + recordName + ' records found';
        }
    }

    getRecordRetrievedText(recordName: string) {
        return recordName + ' retrieved successfully';
    }

    getRecordCreatedText(recordName: string) {
        return recordName + ' created successfully';
    }

    getRecordDeletedText(recordName: string) {
        return recordName + ' deleted successfully';
    }

    getRecordUpdatedText(recordName: string) {
        return recordName + ' updated successfully';
    }

    checkLogin() {
        if (this.flags.alias && this.localConfig.instances) {
            if (!this.localConfig.instances[this.flags.alias]) {
                throw new Error('Not found instance with alias ' + this.flags.alias + '. Check spelling name or login as new instance');
            }
        }
    }

    log(message: string, level: 'info' | 'debug' | 'warn' | 'error') {
        switch (this.flags.loglevel) {
            case 'error':
                if (level === 'error') {
                    this.error(message);
                }
                break;
            case 'debug':
                if (level === 'debug') {
                    this.ux.log(message);
                }
                break;
            case 'warn':
                if (level === 'warn') {
                    this.warn(message);
                }
                break;
            case 'info':
                if (level === 'info') {
                    this.warn(message);
                }
                break;
        }
    }

    /*public async _run<T>(): Promise<any> {
        // If a result is defined for the command, use that.  Otherwise check for a
        // tableColumnData definition directly on the command.
        let err: any;
        try {
            await this.init();
            return await this.run();
        } catch (e) {
            err = e as Error;
            await this.catch(e);
        } finally {
            await this.finally(err);
        }
    }*/

    async init() {
        // do some initialization
        this.localConfig.load();
        super.init();

        const { args, flags } = await this.parse(this.statics);
        this.flags = flags;
        this.args = args;
        this.ux = new UX(this.flags);
        if (this.statics.loginRequired) {
            this.checkLogin();
        }
        this.validateRequiredAndExclusives(this.statics.flags);
    }

    processError(response: JiraCLIResponse<any>, error: any) {
        const err = error as Error;
        if (err.name === 'JiraError') {
            const jiraError = error as JiraError;
            response.status = -1;
            response.message = jiraError.message || jiraError.statusText;
            response.error = jiraError;
            console.error(response.message);
            if (response.error) {
                console.error(JSON.stringify(response.error, null, 2));
            }
        } else {
            throw err;
        }
    }

    async catch(err: any) {
        if (err.code === 'EEXIT') {
            throw err;
        }

        if (err instanceof Error) {
            err.name = err.name === 'JiraError' ? 'JiraError' : err.name.replace(/Error$/, '');
        }

        process.exitCode = process.exitCode || err.exitCode || 1;
        console.error('ERROR: ' + err.message);
    }
    async finally(err: any) {
        // called after run and catch regardless of whether or not the command errored
        return super.finally(err);
    }

    async run(): Promise<any> {

    }

}