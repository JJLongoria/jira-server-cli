import { CliUx } from "@oclif/core";
import { ApplicationProperty } from "jira-server-connector";
import { Instance } from "../types";

export const InstanceColumns: CliUx.Table.table.Columns<Record<string, Instance>> = {
    alias: {
        header: 'Alias',
        minWidth: 10
    },
    host: {
        header: 'Host URL',
        minWidth: 20,
    },
    token: {
        header: 'Token',
        minWidth: 20,
    }
};

export const AppPropertyColumns: CliUx.Table.table.Columns<Record<string, ApplicationProperty>> = {
    id: {
        header: 'ID',
    },
    key: {
        header: 'Key',
    },
    value: {
        header: 'Value',
    },
    name: {
        header: 'Name',
    },
    desc: {
        header: 'Description',
    },
    type: {
        header: 'Type',
    },
    defaultValue: {
        header: 'Default Value',
    },
    example: {
        header: 'Example',
        get: (row: any) => {
            return row.example ? row.example : '';
        },
    },
    allowedValues: {
        header: 'Allowed Values',
        get: (row: any) => {
            return row.allowedValues && row.allowedValues.length ? row.allowedValues.join(', ') : '';
        },
    }
};
