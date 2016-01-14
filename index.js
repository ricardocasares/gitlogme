#!/usr/bin/env node
'use strict';

var cli = require('cli');
var moment = require('moment');
var quote = require('starwars')();

/**
 * User information
 *
 * @type {Object}
 */
var user = {
    git: {
        name: require('git-user-name')(),
        email: require('git-user-email')()
    },
    dates: {
        since: moment(18, 'DD').subtract(1, 'month').format('YYYY-MM-DD'),
        until: moment(18, 'DD').format('YYYY-MM-DD')
    },
    home: require('os-homedir')()
};

/**
 * Catches all exceptions
 */
cli.enable('catchall');

/**
 * Parses the arguments given
 */
cli.parse({
    name: ['n','Your git user', 'string', user.git.name || false],
    email: ['e','Your git email', 'string', user.git.email || false],
    since: ['s','Date to log from, YYYY-MM-DD', 'string', user.dates.since],
    until: ['u','Date to log to, YYYY-MM-DD', 'string', user.dates.until],
    output: ['o','Where do you want to save the file', 'path', user.home],
});

/**
 * Call to main methor
 */
cli.main(main);


/**
 * Main method
 *
 * @param  {Array} args     Arguments array
 * @param  {Object} options Options object
 */
function main(args, options) {
    validateOptions();
    cli.spinner(quote);
    var arg = prepareLogCommand();
    var git = cli.native.child_process.spawn('git', arg);
    cli.options.file = makeFilename();
    var log = cli.native.fs.createWriteStream(cli.options.file);
    // pipe command out to file stream
    git.stdout.pipe(log);
    // hide the spinner
    git.on('close', onGitClose);
}

function onGitClose(code) {
    cli.spinner(quote, true);
    cli.ok(`There you go: ${cli.options.file}`);
}

/**
 * Validates and prepare provided options
 *
 * @param  {object} options Options object
 */
function validateOptions() {
    var options = cli.options;

    if (!resolveAuthor()) throw new Error('You need to configure your git name or email.');

    options.since = moment(options.since, 'YYYY-MM-DD');
    options.until = moment(options.until, 'YYYY-MM-DD');

    [options.since, options.until].forEach((date) => {
        if (!date.isValid()) throw new Error('Please provide dates in YYYY-MM-DD format.');
    });

    if(options.until.isBefore(options.since)) throw new Error('This ain\'t no time machine pal, "until" date must be after "since" date.');
}

/**
 * Prepares the git command before execution
 *
 * @param  {object} options Options object
 * @return {String}         Prepared command
 */
function prepareLogCommand() {
    var options = cli.options;

    return [
        'log',
        '-p',
        '--all',
        '--no-merges',
        `--since=${options.since.format()}`,
        `--until=${options.until.format()}`,
        '--reverse',
        `--author=${resolveAuthor()}`,
        '--pretty=format:"%h%x09%an%x09%ad%x09%s"',
    ];
}

/**
 * Decide what to use for author parameter
 *
 * @param  {Object} options Options object
 * @return {String}         Git email or name
 */
function resolveAuthor() {
    return cli.options.email || cli.options.name;
}

/**
 * Generates a file name
 *
 * @param  {String} options Options object
 * @return {String}         Full path to the file
 */
function makeFilename() {
    var options = cli.options;
    var since = options.since.format('YYYY-MM-DD');
    var until = options.until.format('YYYY-MM-DD');
    var name = [project(), 'samples', since, 'to', until].join('-').concat('.txt');

    return cli.native.path.join(options.output, name);
}

/**
 * Find package.json name entry, fallbacks to current folder name
 *
 * @return {String} Project name
 */
function project() {
    try {
        return require(path.join(process.cwd(), 'package.json')).name;
    } catch(e) {
        return process.cwd().split(cli.native.path.sep).pop();
    }
}
