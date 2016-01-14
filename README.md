# gitlogme
`git log` your last month work to a file. with class.

## Installation
Make sure you have `node` and `npm` installed and run:

`npm i -g gitlogme`

## Usage
Config your git username and email [if you haven't](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup).

Then simply:
* `cd your-awesome-project`
* `gitlogme`

#### Options
All options are... optional! `gitlogme` will try to find out these by itself.

`-n`, `--name [STRING]` Your git user

`-e`, `--email [STRING]` Your git email

`-s`, `--since [STRING]` Date to log from, YYYY-MM-DD

`-u`, `--until [STRING]` Date to log to, YYYY-MM-DD

`-o`, `--output [PATH]` Where do you want to save the file (Default is your OS home folder)

`-h`, `--help` Display help and usage details

## Contribute
Feel free to fill an issue or send a pull-request.
