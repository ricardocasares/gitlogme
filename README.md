# gitlogme

[![Greenkeeper badge](https://badges.greenkeeper.io/ricardocasares/gitlogme.svg)](https://greenkeeper.io/)

`git log` your last month work to a file. With class.

## Installation

Make sure you have `node` and `npm` installed and run:

`npm i -g gitlogme`

## Usage

For the sake of simplicity, config your git username and email [if you haven't](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup). Otherwise, you will have to provide `--name` or `--email` arguments.

Then simply:

- `cd your-awesome-project`
- `gitlogme`

#### Options

All options are... optional! `gitlogme` will try to find out these by itself.

| option          | type    | description                                                |
| --------------- | ------- | ---------------------------------------------------------- |
| `-n` `--name`   | String  | Your git user                                              |
| `-e` `--email`  | Email   | Your git email                                             |
| `-s` `--since`  | String  | Date to log from, YYYY-MM-DD, default is 18th last month   |
| `-u` `--until`  | String  | Date to log to, YYYY-MM-DD, default is 18th current month  |
| `-f` `--format` | String  | Git log format, default is `%h%x09%an%x09%ad%x09%s`        |
| `-d` `--dest`   | Path    | Where do you want to save the file, default is OS home dir |
| `-o` `--open`   | Boolean | Open the file upon creation                                |
| `-h` `--help`   | Boolean | Displays help menu                                         |

#### Examples

So let's say you'd like to generate a log file with all your commits since 2014

`gitlogme --since 2014`

Or maybe you want to see your workmate's log

`gitlogme --name Joe --since 2014`

## Contribute

Feel free to fill an issue, pull-request are preferred.

**IMPORTANT:** Always create feature branches from the `beta` branch.

### Automated versioning

We use `semantic-release` to automate the versioning process, make sure you follow the [commit message convention explained here](https://github.com/semantic-release/semantic-release#commit-message-format).

**HEADS UP:** If you are not sure how write a commit message, make your changes in your feature branch and run `npm run commit` and follow the assistant.

### Releases

#### Beta

Create a feature branch and make a pull-request to `beta` branch.
Once its merged, you can try and install the package using `@beta` dist tag on `npm`.

```bash
> npm i -g gitlogme@beta
```

#### Production

Create a new pull-request from `beta` to `master` branch.
Once it gets merged, the final version will be released using `@latest` dist tag on `npm`.
