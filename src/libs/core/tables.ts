import { CliUx } from "@oclif/core";
import { ApplicationProperty, ApplicationRole, Attachment, AttachmentMeta } from "jira-server-connector";
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
    key: {
        header: 'Key',
    },
    name: {
        header: 'Name',
    },
    groups: {
        header: 'Groups',
        get: (row: any) => {
            return row.groups && row.groups.length ? row.groups.join(', ') : '';
        },
    },
    defaultGroups: {
        header: 'Default Groups',
        get: (row: any) => {
            return row.defaultGroups && row.groups.defaultGroups ? row.defaultGroups.join(', ') : '';
        },
    },
    selectedByDefault: {
        header: 'Default Selected',
    },
    defined: {
        header: 'Defined',
    },
    numberOfSeats: {
        header: 'Number of Seats',
        extended: true,
    },
    remainingSeats: {
        header: 'Remaining Seats',
        extended: true,
    },
    userCount: {
        header: 'User Count',
        extended: true,
    },
    userCountDescription: {
        header: 'User Count Description',
        extended: true,
    },
    hasUnlimitedSeats: {
        header: 'Unlimited Seats',
        extended: true,
    },
    platform: {
        header: 'Patform',
        extended: true,
    },
};

export const AppRoleColumns: CliUx.Table.table.Columns<Record<string, ApplicationRole>> = {
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

export const AttachmentColumns: CliUx.Table.table.Columns<Record<string, Attachment>> = {
    id: {
        header: 'ID',
    },
    filename: {
        header: 'File Name',
    },
    author: {
        header: 'Author',
        get: (row: any) => {
            return row.author.name;
        },
    },
    created: {
        header: 'Created',
        extended: true,
    },
    size: {
        header: 'Size',
        extended: true,
    },
    mimeType: {
        header: 'Mime Type',
    },
};

export const AttachmentMetaColumns: CliUx.Table.table.Columns<Record<string, AttachmentMeta>> = {
    enabled: {
        header: 'Enabled',
    },
    uploadLimit: {
        header: 'Upload Limit',
    },
};

