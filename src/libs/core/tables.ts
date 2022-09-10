import { CliUx } from "@oclif/core";
import { ApplicationProperty, ApplicationRole, Attachment, AttachmentMeta, Avatar, Component, ComponentIssuesCount, Configuration, CustomField, CustomFieldOption, Dashboard, DeletedFieldsOutput, EntityProperty, EntityPropertyKey, Field, Filter } from "jira-server-connector";
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

export const AvatarColumns: CliUx.Table.table.Columns<Record<string, Avatar>> = {
    id: {
        header: 'ID',
    },
    owner: {
        header: 'Owner',
    },
    isSystemAvatar: {
        header: 'System Avatar',
    },
    isSelected: {
        header: 'Is Selected',
    },
    isDeletable: {
        header: 'Deletable',
    },
    urls: {
        header: 'URLs',
    },
    selected: {
        header: 'Selected',
    },
};

export const ComponentColumns: CliUx.Table.table.Columns<Record<string, Component>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    description: {
        header: 'Description',
    },
    lead: {
        header: 'Lead',
        get(row: any) {
            return row.lead ? row.lead.name : '';
        },
        extended: true,
    },
    leadUserName: {
        header: 'Lead Username',
    },
    assigneeType: {
        header: 'Assignee Type',
    },
    assignee: {
        header: 'Assignee',
        get(row: any) {
            return row.assignee ? row.assignee.name : '';
        },
        extended: true,
    },
    realAssigneeType: {
        header: 'Real Type Assignee',
    },
    realAssignee: {
        header: 'Real Assignee',
        get(row: any) {
            return row.realAssignee ? row.realAssignee.name : '';
        },
        extended: true,
    },
    isAssigneeTypeValid: {
        header: 'Valid Assignee Type',
        extended: true,
    },
    project: {
        header: 'Project',
    },
    projectId: {
        header: 'Project ID',
        extended: true,
    },
    archived: {
        header: 'Archived',
        extended: true,
    },
    deleted: {
        header: 'Delete',
        extended: true,
    },
};

export const ComponentIssuesCountColumns: CliUx.Table.table.Columns<Record<string, ComponentIssuesCount>> = {
    issueCount: {
        header: 'Issue Count',
    },
};

export const ConfigurationColumns: CliUx.Table.table.Columns<Record<string, Configuration>> = {
    votingEnabled: {
        header: 'Voting Enabled',
    },
    watchingEnabled: {
        header: 'Watching Enabled',
    },
    unassignedIssuesAllowed: {
        header: 'Unassigned Issues Allowed',
    },
    subTasksEnabled: {
        header: 'Sub-Task Enabled',
    },
    issueLinkingEnabled: {
        header: 'Issue Linking Enabled',
    },
    timeTrackingEnabled: {
        header: 'Time Tracking Enabled',
    },
    attachmentsEnabled: {
        header: 'Attachments Enabled',
    },
    workingHoursPerDay: {
        header: 'Working Hours',
        get(row: any) {
            return row.timeTrackingEnabled && row.timeTrackingConfiguration?.workingHoursPerDay ? row.timeTrackingConfiguration.workingHoursPerDay : '';
        },
    },
    workingDaysPerWeek: {
        header: 'Working Days',
        get(row: any) {
            return row.timeTrackingEnabled && row.timeTrackingConfiguration?.workingDaysPerWeek ? row.timeTrackingConfiguration.workingDaysPerWeek : '';
        },
    },
    timeFormat: {
        header: 'Time Format',
        get(row: any) {
            return row.timeTrackingEnabled && row.timeTrackingConfiguration?.timeFormat ? row.timeTrackingConfiguration.timeFormat : '';
        },
    },
    defaultUnit: {
        header: 'Default Unit',
        get(row: any) {
            return row.timeTrackingEnabled && row.timeTrackingConfiguration?.defaultUnit ? row.timeTrackingConfiguration.defaultUnit : '';
        },
    },
};

export const CustomFieldOptionColumns: CliUx.Table.table.Columns<Record<string, CustomFieldOption>> = {
    value: {
        header: 'Value',
    },
    disabled: {
        header: 'Disabled',
    },
};

export const CustomFieldColumns: CliUx.Table.table.Columns<Record<string, CustomField>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    description: {
        header: 'Description',
    },
    type: {
        header: 'Type',
    },
    searchKey: {
        header: 'Search Key',
    },
    projectIds: {
        header: 'Project Ids',
        get(row: any) {
            return row.projectIds && row.projectIds.length ? row.projectIds.join(', ') : '';
        },
        extended: true,
    },
    issueTypeIds: {
        header: 'Issue Type Ids',
        get(row: any) {
            return row.issueTypeIds && row.issueTypeIds.length ? row.issueTypeIds.join(', ') : '';
        },
        extended: true,
    },
    numericId: {
        header: 'Numeric ID',
        extended: true,
    },
    isLocked: {
        header: 'Locked',
        extended: true,
    },
    isManaged: {
        header: 'Managed',
        extended: true,
    },
    isAllProjects: {
        header: 'All Projects',
        extended: true,
    },
    isTrusted: {
        header: 'Trusted',
        extended: true,
    },
    projectsCount: {
        header: 'Project Counts',
        extended: true,
    },
    screensCount: {
        header: 'Screen Counts',
        extended: true,
    },
    lastValueUpdate: {
        header: 'Last Value Update',
        extended: true,
    },
    issuesWithValue: {
        header: 'Issues with Value',
        extended: true,
    },
};

export const DeletedFieldsColumns: CliUx.Table.table.Columns<Record<string, DeletedFieldsOutput>> = {
    message: {
        header: 'Message',
    },
    deletedCustomFields: {
        header: 'Deleted Fields',
        get(row: any) {
            return row.deletedCustomFields && row.deletedCustomFields.length ? row.deletedCustomFields.join(', ') : '';
        },
    },
    notDeletedCustomFields: {
        header: 'Not Deleted Fields',
        get(row: any) {
            return row.notDeletedCustomFields && row.notDeletedCustomFields.length ? row.notDeletedCustomFields.join(', ') : '';
        },
    },
};

export const DashboardColumns: CliUx.Table.table.Columns<Record<string, Dashboard>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    view: {
        header: 'view',
    },
};

export const EntityPropertyKeyColumns: CliUx.Table.table.Columns<Record<string, EntityPropertyKey>> = {
    key: {
        header: 'Key',
    },
};

export const EntityPropertyColumns: CliUx.Table.table.Columns<Record<string, EntityProperty>> = {
    key: {
        header: 'Key',
    },
};

export const FieldColumns: CliUx.Table.table.Columns<Record<string, Field>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    custom: {
        header: 'Custom',
    },
    orderable: {
        header: 'Orderable',
    },
    navigable: {
        header: 'Navigable',
    },
    searchable: {
        header: 'Searchable',
    },
    clauseNames: {
        header: 'Clause Names',
        get(row: any) {
            return row.clauseNames && row.clauseNames.length ? row.clauseNames.join(', ') : '';
        },
        extended: true,
    },
    schema: {
        header: 'Schema',
        get(row: any) {
            return row.schema && row.schema.type ? row.schema.type : '';
        },
        extended: true,
    },
};

export const FilterColumns: CliUx.Table.table.Columns<Record<string, Filter>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    description: {
        header: 'Description',
    },
    owner: {
        header: 'owner',
        get(row: any) {
            return row.owner ? row.owner.name : '';
        },
    },
    jql: {
        header: 'JQL',
    },
    viewUrl: {
        header: 'View URL',
        extended: true,
    },
    searchUrl: {
        header: 'Search URL',
        extended: true,
    },
    favourite: {
        header: 'Favourite',
        extended: true,
    },
    editable: {
        header: 'Editable',
        extended: true,
    },
};

