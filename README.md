[**Jira Server CLI Application - BETA -**]()
=================

[![Version](https://img.shields.io/npm/v/jira-server-cli?logo=npm)](https://www.npmjs.com/package/jira-server-cli)
[![Total Downloads](https://img.shields.io/npm/dt/jira-server-cli?logo=npm)](https://www.npmjs.com/package/jira-server-cli/core)
[![Downloads/Month](https://img.shields.io/npm/dm/jira-server-cli?logo=npm)](https://www.npmjs.com/package/jira-server-cli)
[![Issues](https://img.shields.io/github/issues/jjlongoria/jira-server-cli)](https://github.com/JJLongoria/jira-server-cli/issues)
[![Known Vulnerabilities](https://snyk.io/test/github/JJLongoria/jira-server-cli/badge.svg)](https://snyk.io/test/github/JJLongoria/jira-server-cli)
[![Code Size](https://img.shields.io/github/languages/code-size/jjlongoria/jira-server-cli)](https://github.com/JJLongoria/jira-server-cli)
[![License](https://img.shields.io/github/license/jjlongoria/jira-server-cli?logo=github)](https://github.com/JJLongoria/jira-server-cli/blob/master/LICENSE)

**CLI application** to manage and work with **Atlassian Jira Server**. The benefits of a CLI applications are both, able to the users to **handle Jira Issues outside Jira**, and more important, can **automate** Tasks against Jira like autoresolve issues for example. This tool are designed to be really easy to learn and use because group topics and commands with a semantic names.

**Jira Server CLI** allow to any user to work with **Jira outside Jira** from a command line. Admin Jira with the Administration commands or updated your user details easy from the command line. You can Create or Update issues with a simple command. Add comments to a issue. Grant or Revoke  permissions in a few steps and every what you want with Jira.

**Automate** every task from the command line easy to make many things automatically. There are many posibilities.

To learn more or read a full documentation of the **Jira Server CLI Application**, go to the [**Official Documentation Site**](https://github.com/JJLongoria/jira-server-cli/wiki).

This CLI Application use the [**Jira Server Connector**](https://github.com/JJLongoria/jira-server-connector) library to connect and work with Jira. 

Supported Operative Systems:
- Windows
- Linux
- Mac OS X

Now Stil in BETA Version because is not fully tested.

--- 

- [**Jira Server CLI Application - BETA -**](#jira-server-cli-application---beta--)
- [**Installation Guide**](#installation-guide)
  - [**NPM**](#npm)
  - [**Windows Standalone**](#windows-standalone)
- [**Usage**](#usage)
- [**CLI Responses**](#cli-responses)
  - [**JiraCLIResponse<T>**](#jiracliresponset)
  - [**JiraCLIError**](#jiraclierror)
  - [**JiraCLIErrorData**](#jiraclierrordata)
- [**Paginated API**](#paginated-api)
  - [**Pagination Flags**](#pagination-flags)
- [**CLI Output Format**](#cli-output-format)
  - [**Table**](#table)
  - [**JSON**](#json)
  - [**CSV**](#csv)
- [**Core CLI Commands**](#core-cli-commands)
  - [**`jiraserver help [COMMAND]`**](#jiraserver-help-command)
  - [**`jiraserver update`**](#jiraserver-update)
  - [**`jiraserver commands`**](#jiraserver-commands)
  - [**`jiraserver plugins`**](#jiraserver-plugins)
  - [**`jiraserver plugins:install PLUGIN...`**](#jiraserver-pluginsinstall-plugin)
  - [**`jiraserver plugins:inspect PLUGIN...`**](#jiraserver-pluginsinspect-plugin)
  - [**`jiraserver plugins:link PLUGIN`**](#jiraserver-pluginslink-plugin)
  - [**`jiraserver plugins:uninstall PLUGIN...`**](#jiraserver-pluginsuninstall-plugin)
- [**Main CLI Topics**](#main-cli-topics)
- [**JSON Objects Schemes**](#json-objects-schemes)
  - [**ApplicationProperty**](#applicationproperty)
  - [**ApplicationRole**](#applicationrole)
  - [**ApplicationRoleInput**](#applicationroleinput)
  - [**Attachment**](#attachment)
  - [**Avatar**](#avatar)
  - [**AttachmentMeta**](#attachmentmeta)
  - [**Component**](#component)
  - [**ComponentInput**](#componentinput)
  - [**ComponentIssuesCount**](#componentissuescount)
  - [**Configuration**](#configuration)
  - [**ConfigurationTimeTracking**](#configurationtimetracking)
  - [**CustomFieldOption**](#customfieldoption)
  - [**Instance**](#instance)
  - [**Group**](#group)
  - [**ListWrapper**](#listwrapper)
  - [**SystemAvatars**](#systemavatars)
  - [**User**](#user)


# [**Installation Guide**]()

## [**NPM**]()

Installation with NPM manager is, at the moment, the unique way to install Jira Server CLI on Linux and MacOs systems. 

Install Node JS on your computer:

To install NodeJS on Windows systems go to [Node JS Webpage](https://nodejs.org/) and download the latest version for Windows.

To install NodeJS on Linux systems go to ["Installing Node.js via package manager"](https://nodejs.org/en/download/package-manager/) and choose the correct option according your linux system.

With NodeJS installed on your system, now open a terminal (CMD, Bash, Power Shell...) and run the next command:

    npm install -g jira-server-cli

## [**Windows Standalone**]()

If you don't want to install NPM on your windows system to install Jira Server CLI, can download the installer and install it without node on windows systemas.

  - [**Windows x64**](https://github.com/JJLongoria/jira-server-cli/raw/main/installers/jira-server-cli_win_x64.exe)

# [**Usage**]()
```sh-session
$ jiraserver COMMAND [args] [flags]
running command...

$ jiraserver --help [COMMAND]
...
```

# [**CLI Responses**]()

All commands **except Core CLI Commands** return the same response JSON Object for a better reponse handling and standarization. The JSON response definition is the next:

## [**JiraCLIResponse<T>**]()

```js
{
	status: 0 | -1 = 0;		    // Returned status. 0 OK, -1 KO
	message?: string;		      // General execution status message
	result?: T;				        // Response data when status is 0. (Not all Ok responses return data)
	error?: JiraCLIError;	    // Error data when status is -1.
}
```

The **`JiraCLIResponse`** `result` property has **Generic type** (`T`), that means the result can be of any type defined in [**JSON Objects Schemes**](#json-objects-schemes) or primitive types likes `string` or `string[]` among others.

## [**JiraCLIError**]()

The **`JiraCLIResponse`** object contains the `JiraCLIError` on `error` property to return the errors data. This object has the next definition:

```js
{
	  statusCode?: number;			    // The status code of execution
    status?: string;				      // The error status
    statusText?: string;			    // The error status text
    errors?: JiraCLIErrorData[];	// Error details
}
```

## [**JiraCLIErrorData**]()

The error object **`JiraCLIError`** has a collection of errors with detailed error data, the JSON object is the next:

```js
{
    errorMessages: string[],            // Error messages list
    errors: { [key: string]: string },  // Error messages map
    status: number,                     // Error status
}
```


# [**Paginated API**]()

The **Jira API Rest** work with **paginated results**, this means that the most of list commands return a **`Page<T>`** whith a collection of values of the requested data types. For example, when retrieve projects, get a **`Page<Project>`** with the paginated values.

The **`Page<T>`** object has the page data, size, limit and next page start among other data to use the paginated API. 

```ts
class Page<T> {
    startAt: number;        // The first record page
    maxResults: number;     // Max page results
    total: number;          // Total results
    isLast: boolean;        // true if is the last page
    values: T[];            // Collection values
    self?: string;          // Self link
    nextPage?: string;      // Next page link
    previousPage?: string;  // Previous page link
    nextPageStart?: number; // First record of the next page
}
```

**IMPORTANT**: The response contains a "total" field which denotes the total number of entities contained in all pages. This number may change as the client requests the subsequent pages. A client should always assume that the requested page can be empty. REST API consumers should also consider the field to be optional. In cases, when calculating this value is too expensive we may not include this in response. 

## [**Pagination Flags**]()

All commands that support paginations (the most of list commands) has the same flags to support and user the paginated api, this flags are listed below:
| Name       | flag       | Type          | Description                                                                                                                                                                                           |
| ---------- | ---------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **All**    | `--all`    | [`Boolean`]() | Return all records on the same page (instead paginate results)                                                                                                                                        |
| **Limit**  | `--limit`  | [`Integer`]() | Indicates how many results to return per page                                                                                                                                                         |
| **Start**  | `--start`  | [`Integer`]() | Indicates which item should be used as the first item in the page of results                                                                                                                          |
| **order**  | `--start`  | [`string`]()  | Some resources support ordering by a specific field. Ordering can be ascending or descending. To specify the ordering use "-" or "+" sign. Examples: --order "+name"; --order "name"; --order "-name" |
| **expand** | `--expand` | [`string`]()  | Some resources support support to expand the returned informacion                                                                                                                                     |

# [**CLI Output Format**]()

The Jira Server CLI support to return the output in different formats, CSV, JSON and Table. All commands support the JSON Output. All commands that return data into the `result` property support Table and CSV outputs. All commands that support tables, support also CSV output.

## [**Table**]()

Is the standard output if not select any other type, this is the best human readable response. All commands that support CSV output, support tables output too. To many commands has the `--extended` flag. This flag is for show more columns on the tables (By default, not show all columns in many commands).

## [**JSON**]()

Is the most complete response and the best to work with the command, but is not human readable like a table. The flag to return a JSON output is `--json`

## [**CSV**]()

To many commands support to format the output as JSON (the same with output as table). This response contains the same information of an extended table but in different format. The flag to format as csv is `--csv`.


# [**Core CLI Commands**]()

## **`jiraserver help [COMMAND]`**

Display help for Jira Server CLI.

```
USAGE
  $ jiraserver help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for Jira Server CLI.
```

## **`jiraserver update`**

Update the Jira Server CLI.

```
USAGE
  $ jiraserver update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  Update the Jira Server CLI

EXAMPLES
  Update to the stable channel:

    $ jiraserver update stable

  Update to a specific version:

    $ jiraserver update --version 1.0.0

  Interactively select version:

    $ jiraserver update --interactive

  See available versions:

    $ jiraserver update --available
```

## **`jiraserver commands`**

List all the commands

```
USAGE
  $ jiraserver commands [--json] [-h] [--hidden] [--tree] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)
  --tree             show tree of commands

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all the commands
```

## **`jiraserver plugins`**

List installed plugins.

```
USAGE
  $ jiraserver plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ jiraserver plugins
```


## **`jiraserver plugins:install PLUGIN...`**

Installs a plugin into the CLI.

```
USAGE
  $ jiraserver plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a "hello" command, installing a user-installed plugin with a "hello" command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ jiraserver plugins add

EXAMPLES
  $ jiraserver plugins:install myplugin 

  $ jiraserver plugins:install https://github.com/someuser/someplugin

  $ jiraserver plugins:install someuser/someplugin
```

## **`jiraserver plugins:inspect PLUGIN...`**

Displays installation properties of a plugin.

```
USAGE
  $ jiraserver plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ jiraserver plugins:inspect myplugin
```

## **`jiraserver plugins:link PLUGIN`**

Links a plugin into the CLI for development.

```
USAGE
  $ jiraserver plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a "hello" command, installing a linked plugin with a "hello"
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ jiraserver plugins:link myplugin
```

## **`jiraserver plugins:uninstall PLUGIN...`**

Removes a plugin from the CLI.

```
USAGE
  $ jiraserver plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ jiraserver plugins unlink
  $ jiraserver plugins remove
```

Removes a plugin from the CLI.

```
USAGE
  $ jiraserver plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ jiraserver plugins unlink
  $ jiraserver plugins remove
```


# [**Main CLI Topics**]()

The [**Jira Server CLI Application**]() has to many commands to handle to many Jira Server features. All commands are grouped in **topics**, any many topics has **subtopics** to better organization of commands (and better to learn and understand).

The main topics are listed below.


# [**JSON Objects Schemes**]()

All JSON Schemes used by the Jira Server CLI application as response or data input are listed bellow.

**Schema definition**:
```json
{
  "FieldName": "FieldType", // Required field
  "FieldName?": "FieldType", // Optional field
}
```
---
---
## [**ApplicationProperty**]()
```json
{
    "id": "string",
    "key": "string",
    "value": "string",
    "name": "string",
    "desc": "string",
    "type": "string",
    "defaultValue": "string",
    "example?": "string",
    "allowedValues?": "string[]",
}
```
---
## [**ApplicationRole**]()
```json
{
    "key": "string",
    "groups": "string[]",
    "name": "string",
    "defaultGroups": "string[]",
    "selectedByDefault": "boolean",
    "defined": "boolean",
    "numberOfSeats": "number",
    "remainingSeats": "number",
    "userCount": "number",
    "userCountDescription": "string",
    "hasUnlimitedSeats": "boolean",
    "platform": "boolean",
}
```
---
## [**ApplicationRoleInput**]()
```json
{
    "key": "string",
    "group?s": "string[]",
    "defaultGroups?": "string[]",
}
```
---
## [**Attachment**]()
```json
{
    "id": "string",
    "filename": "string",
    "author": "User",
    "created": "string",
    "size": "number",
    "mimeType": "string",
    "properties": "any",
    "content": "string",
    "thumbnail": "string",
}
```
- See [**User**](#user) Definition.

## [**Avatar**]()
```json
{
    "id": "string",
    "owner": "string",
    "isSystemAvatar": "boolean",
    "isSelected": "boolean",
    "isDeletable": "boolean",
    "urls": "{ [key: string]: string }",
    "selected": "boolean",
}
```
---
## [**AttachmentMeta**]()
```json
{
    "enabled": "boolean",
    "uploadLimit?": "number",
}
```
---
## [**Component**]()
```json
{
    "id?": "string",
    "name": "string",
    "description": "string",
    "lead?": "User",
    "leadUserName": "string",
    "assigneeType": "'PROJECT_DEFAULT' | 'COMPONENT_LEAD' | 'PROJECT_LEAD' | 'UNASSIGNED'",
    "assignee?": "User",
    "realAssigneeType?": "'PROJECT_DEFAULT' | 'COMPONENT_LEAD' | 'PROJECT_LEAD' | 'UNASSIGNED'",
    "realAssignee?": "User",
    "isAssigneeTypeValid": "boolean",
    "project": "string",
    "projectId": "number",
    "archived?": "boolean",
    "deleted?": "boolean",
}
```
- See [**User**](#user) Definition.

---
## [**ComponentInput**]()
```json
{
    "name": "string",
    "description": "string",
    "leadUserName": "string",
    "assigneeType": "'PROJECT_DEFAULT' | 'COMPONENT_LEAD' | 'PROJECT_LEAD' | 'UNASSIGNED'",
    "isAssigneeTypeValid": "boolean",
    "project": "string",
    "projectId": "number",
}
```
- See [**User**](#user) Definition.

## [**ComponentIssuesCount**]()
```json
{
    "issueCount": "number",
    "self?": "string",
}
```
---
## [**Configuration**]()
```json
{
    "votingEnabled": "boolean",
    "watchingEnabled": "boolean",
    "unassignedIssuesAllowed": "boolean",
    "subTasksEnabled": "boolean",
    "issueLinkingEnabled": "boolean",
    "timeTrackingEnabled": "boolean",
    "attachmentsEnabled": "boolean",
    "timeTrackingConfiguration?": "ConfigurationTimeTracking",
}
```
---
## [**ConfigurationTimeTracking**]()
```json
{
    "workingHoursPerDay": 8,
    "workingDaysPerWeek": 5,
    "timeFormat?": "'pretty' | 'days' | 'hours'",
    "defaultUnit?": "'minute' | 'hour' | 'day' | 'week'",
}
```
---
## [**CustomFieldOption**]()
```json
{
    "value": "string",
    "disabled": "boolean",
    "self?": "string",
}
```
---
## [**Instance**]()
```json
{
    "alias": "string",
    "host": "string",
    "token": "string",
}
```
---
## [**Group**]()
```json
{
    "name": "string",
    "users": "ListWrapper<User>",
    "expand": "string",
    "self?": "string",
}
```
- See [**ListWrapper**](#listwrapper) Definition.
- See [**User**](#user) Definition.

---
## [**ListWrapper**]()

This type support **Generic Types** (**`T`**). That means can be of many types (The specified between <> symbols on parent definition)

```json
{
    "size": "number",
    "max-results?": "number",
    "start-index?": "number",
    "end-index?": "number",
    "items": "T[]",
}
```
---
## [**SystemAvatars**]()
```json
{
    "system": "Avatar[]"
}
```
- See [**Avatar**](#avatar) Definition.

---
## [**User**]()
```json
{
    "key": "string",
    "name": "string",
    "emailAddress": "string",
    "avatarUrls": "{ [key: string]: string }",
    "displayName": "string",
    "active": "boolean",
    "deleted": "boolean",
    "timeZone": "string",
    "locale": "string",
    "groups": "ListWrapper<Group>",
    "applicationRoles": "ListWrapper<ApplicationRole>",
    "expand": "string",
    "self?": "string",
}
```
- See [**ListWrapper**](#listwrapper) Definition.
- See [**Group**](#group) Definition.
- See [**ApplicationRole**](#applicationrole) Definition.


