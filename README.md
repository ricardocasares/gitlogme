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

| option | type | description |
|------|------|-------------|
|`-n` `--name`|String| Your git user |
|`-e` `--email`|Email| Your git email |
|`-s` `--since`|String| Date to log from, YYYY-MM-DD |
|`-u` `--until`|String| Date to log to, YYYY-MM-DD |
|`-d` `--dest`|Path| Where do you want to save the file, default is OS home dir |
|`-o` `--open`|Boolean| Open the file upon creation |
|`-h` `--help`|Boolean| Displays help menu |


## Contribute
Feel free to fill an issue or send a pull-request.
