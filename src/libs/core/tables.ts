import { CliUx } from '@oclif/core';
import { ApplicationProperty, ApplicationRole, Attachment, AttachmentMeta, Avatar, ColumnItem, Comment, Component, ComponentIssuesCount, Configuration, CreateMeta, CustomField, CustomFieldOption, Dashboard, DeletedFieldsOutput, EntityProperty, EntityPropertyKey, Field, FieldMeta, Filter, FilterPermission, Group, GroupSuggestion, Issue, IssueLink, IssueLinkType, IssuePickerSection, IssueRemoteLink, IssueTransition, IssueType, IssueTypeScheme, IssueVotes, IssueWatchers, IssueWorklog, LinkIssue, Permission, PermissionScheme, Project, SecurityScheme, ShareScope, User, UserPermission } from 'jira-server-connector';
import { Instance } from '../types';

export const InstanceColumns: CliUx.Table.table.Columns<Record<string, Instance>> = {
    alias: {
        header: 'Alias',
        minWidth: 10,
    },
    host: {
        header: 'Host URL',
        minWidth: 20,
    },
    token: {
        header: 'Token',
        minWidth: 20,
    },
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
            return row.groups && row.groups.length > 0 ? row.groups.join(', ') : '';
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
            return row.allowedValues && row.allowedValues.length > 0 ? row.allowedValues.join(', ') : '';
        },
    },
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
            return row.projectIds && row.projectIds.length > 0 ? row.projectIds.join(', ') : '';
        },
        extended: true,
    },
    issueTypeIds: {
        header: 'Issue Type Ids',
        get(row: any) {
            return row.issueTypeIds && row.issueTypeIds.length > 0 ? row.issueTypeIds.join(', ') : '';
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
            return row.deletedCustomFields && row.deletedCustomFields.length > 0 ? row.deletedCustomFields.join(', ') : '';
        },
    },
    notDeletedCustomFields: {
        header: 'Not Deleted Fields',
        get(row: any) {
            return row.notDeletedCustomFields && row.notDeletedCustomFields.length > 0 ? row.notDeletedCustomFields.join(', ') : '';
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
            return row.clauseNames && row.clauseNames.length > 0 ? row.clauseNames.join(', ') : '';
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

export const ColumnItemColumns: CliUx.Table.table.Columns<Record<string, ColumnItem>> = {
    label: {
        header: 'Label',
    },
    value: {
        header: 'Value',
    },
};

export const FilterPermissionsColumns: CliUx.Table.table.Columns<Record<string, FilterPermission>> = {
    id: {
        header: 'ID',
    },
    type: {
        header: 'Type',
    },
    project: {
        header: 'Project',
        get(row: any) {
            return row.project ? row.project.key : '';
        },
    },
    group: {
        header: 'Group',
        get(row: any) {
            return row.group ? row.group.name : '';
        },
    },
    user: {
        header: 'User',
        get(row: any) {
            return row.user ? row.user.name : '';
        },
    },
    view: {
        header: 'View',
    },
    edit: {
        header: 'Edit',
    },
};

export const ShareScopeColumns: CliUx.Table.table.Columns<Record<string, ShareScope>> = {
    scope: {
        header: 'Scope',
    },
};

export const GroupColumns: CliUx.Table.table.Columns<Record<string, Group>> = {
    name: {
        header: 'Name',
    },
    expand: {
        header: 'Expand',
    },
};

export const UserColumns: CliUx.Table.table.Columns<Record<string, User>> = {
    key: {
        header: 'Key',
    },
    name: {
        header: 'Name',
    },
    emailAddress: {
        header: 'Email',
    },
    displayName: {
        header: 'Display Name',
    },
    active: {
        header: 'Active',
        extended: true,
    },
    deleted: {
        header: 'Deleted',
        extended: true,
    },
    timeZone: {
        header: 'Time Zone',
        extended: true,
    },
    locale: {
        header: 'Locale',
        extended: true,
    },
    expand: {
        header: 'Expand',
        extended: true,
    },
};

export const GroupSuggestionColumns: CliUx.Table.table.Columns<Record<string, GroupSuggestion>> = {
    header: {
        header: 'Header',
    },
    total: {
        header: 'Total',
    },
};

export const IssueLinkColumns: CliUx.Table.table.Columns<Record<string, IssueLink>> = {
    id: {
        header: 'ID',
    },
    key: {
        header: 'Key',
    },
};

export const IssueColumns: CliUx.Table.table.Columns<Record<string, Issue>> = {
    id: {
        header: 'ID',
    },
    key: {
        header: 'Key',
    },
    expand: {
        header: 'Expand',
    },
};

export const CommentColumns: CliUx.Table.table.Columns<Record<string, Comment>> = {
    id: {
        header: 'ID',
    },
    body: {
        header: 'Body',
    },
    author: {
        header: 'Author',
        get(row: any) {
            return row.user ? row.user.name : '';
        },
    },
    renderedBody: {
        header: 'Rendered Body',
        extended: true,
    },
    updateAuthor: {
        header: 'Updated Author',
        get(row: any) {
            return row.updateAuthor ? row.updateAuthor.name : '';
        },
        extended: true,
    },
    created: {
        header: 'Created',
        extended: true,
    },
    updated: {
        header: 'Updated',
        extended: true,
    },
    visibility: {
        header: 'Visibility',
        get(row: any) {
            return row.visibility ? row.visibility.type + ': ' + row.visibility.value : '';
        },
        extended: true,
    },
};

export const IssueRemoteLinkColumns: CliUx.Table.table.Columns<Record<string, IssueRemoteLink>> = {
    id: {
        header: 'ID',
    },
    globalId: {
        header: 'Global Id',
    },
    application: {
        header: 'Global Id',
        get(row: any) {
            return row.application.name;
        },
    },
    relationship: {
        header: 'Relationship',
    },
};

export const IssueTransitionColumns: CliUx.Table.table.Columns<Record<string, IssueTransition>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    opsbarSequence: {
        header: 'Sequence',
    },
    to: {
        header: 'Status',
        get(row: any) {
            return row.to.name;
        },
    },
    expand: {
        header: 'Expand',
    },
};

export const FieldMetaColumns: CliUx.Table.table.Columns<Record<string, FieldMeta>> = {
    fieldId: {
        header: 'Field Id',
    },
    name: {
        header: 'Name',
    },
    required: {
        header: 'Required',
    },
    autoCompleteUrl: {
        header: 'Autocomplete URL',
    },
    hasDefaultValue: {
        header: 'Has Default Value',
    },
    operations: {
        header: 'Operations',
        get(row: any) {
            return row.operations && row.operations.length > 0 ? row.operations.join(', ') : '';
        },
    },
};

export const IssueVotesColumns: CliUx.Table.table.Columns<Record<string, IssueVotes>> = {
    votes: {
        header: 'Votes',
    },
    hasVoted: {
        header: 'Has Voted',
    },
};

export const IssueWatchersColumns: CliUx.Table.table.Columns<Record<string, IssueWatchers>> = {
    isWatching: {
        header: 'Is Watching',
    },
    watchCount: {
        header: 'Watch Count',
    },
};

export const IssueWorklogColumns: CliUx.Table.table.Columns<Record<string, IssueWorklog>> = {
    id: {
        header: 'ID',
    },
    issueId: {
        header: 'Issue Id',
    },
    comment: {
        header: 'Comment',
    },
    created: {
        header: 'Created',
    },
    updated: {
        header: 'Updated',
        extended: true,
    },
    visibility: {
        get(row: any) {
            return row.visibility.type + ': ' + row.visibility.value;
        },
        extended: true,
    },
    started: {
        header: 'Started',
        extended: true,
    },
    timeSpent: {
        header: 'Time Spent',
        extended: true,
    },
    timeSpentSeconds: {
        header: 'Time Spent (s)',
        extended: true,
    },
    author: {
        header: 'Author',
        get(row: any) {
            return row.author.name;
        },
    },
    updateAuthor: {
        header: 'Update Author',
        get(row: any) {
            return row.updateAuthor.name;
        },
        extended: true,
    },

};

export const CreateMetaColumns: CliUx.Table.table.Columns<Record<string, CreateMeta>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    description: {
        header: 'Description',
    },
    iconUrl: {
        header: 'Icon URL',
    },
    subtask: {
        header: 'Subtask',
    },
    avatarId: {
        header: 'Avatar Id',
    },
    expand: {
        header: 'Expand',
    },
};

export const IssuePickerSectionColumns: CliUx.Table.table.Columns<Record<string, IssuePickerSection>> = {
    id: {
        header: 'ID',
    },
    label: {
        header: 'Label',
    },
    sub: {
        header: 'Sub',
    },
    msg: {
        header: 'Message',
    },
    issues: {
        header: 'Issues',
        get(row: any) {
            return row.issues.length;
        },
    },
};

export const LinkIssueColumns: CliUx.Table.table.Columns<Record<string, LinkIssue>> = {
    type: {
        header: 'Type',
        get(row: any) {
            return row.type.name;
        },
    },
    inwardIssue: {
        header: 'Inward Issue',
        get(row: any) {
            return row.inwardIssue.key;
        },
    },
    outwardIssue: {
        header: 'Outward Issue',
        get(row: any) {
            return row.outwardIssue.key;
        },
    },
    comment: {
        header: 'Type',
        get(row: any) {
            return row.comment ? row.comment.body : '';
        },
    },
};

export const IssueLinkTypeColumns: CliUx.Table.table.Columns<Record<string, IssueLinkType>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    inward: {
        header: 'Inward',
    },
    outward: {
        header: 'Outward',
    },
};

export const SecuritySchemeColumns: CliUx.Table.table.Columns<Record<string, SecurityScheme>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    description: {
        header: 'Description',
    },
    defaultSecurityLevelId: {
        header: 'Default Level Id',
    },
};

export const IssueTypeColumns: CliUx.Table.table.Columns<Record<string, IssueType>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    description: {
        header: 'Description',
    },
    iconUrl: {
        header: 'Icon URL',
    },
    subtask: {
        header: 'Subtask',
    },
    avatarId: {
        header: 'Avatar Id',
    },
};

export const IssueTypeSchemeColumns: CliUx.Table.table.Columns<Record<string, IssueTypeScheme>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    description: {
        header: 'Description',
    },
    defaultIssueType: {
        header: 'Default Issue Type',
        get(row: any) {
            return row.defaultIssueType.name;
        },
    },
    issueTypes: {
        header: 'Subtask',
        get(row: any) {
            return row.issueTypes.map((element: any) => {
                return element.name;
            });
        },
    },
    expand: {
        header: 'Expand',
    },
};

export const ProjectColumns: CliUx.Table.table.Columns<Record<string, Project>> = {
    id: {
        header: 'ID',
    },
    key: {
        header: 'Key',
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
            return row.lead.name;
        },
    },
    url: {
        header: 'URL',
    },
    email: {
        header: 'Email',
        extended: true,
    },
    assigneeType: {
        header: 'Assignee Type',
        extended: true,
    },
    projectKeys: {
        header: 'Project Keys',
        get(row: any) {
            return row.projectKeys && row.projectKeys.length > 0 ? row.projectKeys.join(', ') : '';
        },
        extended: true,
    },
    projectCategory: {
        header: 'Project Category',
        get(row: any) {
            return row.projectCategory ? row.projectCategory.name : '';
        },
        extended: true,
    },
    projectTypeKey: {
        header: 'Project Type Key',
        extended: true,
    },
    archived: {
        header: 'Archived',
        extended: true,
    },
};

export const PermissionColumns: CliUx.Table.table.Columns<Record<string, Permission>> = {
    key: {
        header: 'Key',
    },
    name: {
        header: 'Name',
    },
    type: {
        header: 'Type',
    },
    description: {
        header: 'Description',
    },
};

export const UserPermissionColumns: CliUx.Table.table.Columns<Record<string, UserPermission>> = {
    id: {
        header: 'ID',
    },
    key: {
        header: 'Key',
    },
    name: {
        header: 'Name',
    },
    type: {
        header: 'Type',
    },
    description: {
        header: 'Description',
    },
    havePermission: {
        header: 'Have Permission',
    },
};

export const PermissionSchemeColumns: CliUx.Table.table.Columns<Record<string, PermissionScheme>> = {
    key: {
        header: 'Key',
    },
    name: {
        header: 'Name',
    },
    description: {
        header: 'Description',
    },
    expand: {
        header: 'Expand',
    },
};
