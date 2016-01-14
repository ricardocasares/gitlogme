#!/usr/bin/env node
'use strict';

var cli    = require('cli');
var moment = require('moment');
var quote  = require('starwars')();
var spawn  = require('child_process').spawn;
var stream = require('fs').createWriteStream;

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
    name: ['n','Your git user', 'string', user.git.name],
    email: ['e','Your git email', 'string', user.git.email],
    since: ['s','Date to log from, YYYY-MM-DD', 'string', user.dates.since],
    until: ['u','Date to log to, YYYY-MM-DD', 'string', user.dates.until],
    output: ['o','Where do you want to save the file', 'path', user.home],
});

/**
 * Call to main method
 */
cli.main(main);


/**
 * Main method
 *
 * @param  {Array}  args     Arguments array
 * @param  {Object} options  Options object
 */
function main(args, options) {
    prepareOptions();
    cli.spinner(quote);
    var git = spawn('git', command());
    var log = stream(cli.options.file);
    // pipe stdout to log stream
    git.stdout.pipe(log);
    // say good-bye!
    git.on('close', onGitClose);
}

/**
 * Stream close handler
 *
 * @param  {code} code Process exit code
 */
function onGitClose(code) {
    cli.spinner(quote, true);
    cli.ok(`There you go: ${cli.options.file}`);
}

/**
 * Prepares and validates options
 */
function prepareOptions() {
    var opts = cli.options;

    if (!author()) throw new Error('You need to configure your git name or email.');

    opts.since = moment(opts.since, 'YYYY-MM-DD');
    opts.until = moment(opts.until, 'YYYY-MM-DD');
    opts.file  = filename();

    [opts.since, opts.until].forEach((date) => {
        if (!date.isValid()) throw new Error('Please provide dates in YYYY-MM-DD format.');
    });

    if(opts.until.isBefore(opts.since)) throw new Error('This ain\'t no time machine pal, "until" date must be after "since" date.');
}

/**
 * Prepares the git command before execution
 *
 * @return {String} Prepared command
 */
function command() {
    var opts = cli.options;

    return [
        'log',
        '-p',
        '--all',
        '--no-merges',
        `--since=${opts.since.format()}`,
        `--until=${opts.until.format()}`,
        '--reverse',
        `--author=${author()}`,
        '--pretty=format:"%h%x09%an%x09%ad%x09%s"',
    ];
}

/**
 * Decide what to use for author parameter
 *
 * @return {String}         Git email or name
 */
function author() {
    return cli.options.email || cli.options.name;
}

/**
 * Generates a file name with path to OS home dir
 *
 * @return {String} Full path to the file
 */
function filename() {
    var opts  = cli.options;
    var since = opts.since.format('YYYY-MM-DD');
    var until = opts.until.format('YYYY-MM-DD');
    var name  = [project(), 'samples', since, 'to', until].join('-').concat('.txt');

    return cli.native.path.join(opts.output, name);
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
