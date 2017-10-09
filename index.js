#!/usr/bin/env node
'use strict';

var cli    = require('cli');
var path   = require('path');
var open   = require('open');
var chalk  = require('chalk');
var moment = require('moment');
var quote  = require('starwars')();
var spawn  = require('cross-spawn-async');
var stream = require('fs').createWriteStream;

/**
 * Chalk styles
 */
var b = chalk.bold;
var g = chalk.green;
var m = chalk.bgMagenta;

/**
 * Spinner text
 */
var spinner = m(b(`“${quote}”`));

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
 * Plugins
 */
cli.enable('catchall');

/**
 * Parses the arguments given options
 */
cli.parse({
    name: ['n','Your git user', 'string'],
    email: ['e','Your git email', 'email'],
    since: ['s','Date to log from, YYYY-MM-DD', 'string', user.dates.since],
    until: ['u','Date to log to, YYYY-MM-DD', 'string', user.dates.until],
    format: ['f','Git log format', 'string', '%h%x09%an%x09%ad%x09%s'],
    open: ['o','Open file upon creation', 'boolean', false],
    dest: ['d','Where do you want to save the file', 'path', user.home]
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
function main() {
    prepareOptions();
    cli.spinner(spinner);
    var git = spawn('git', command(), { cwd: process.cwd() });
    var log = stream(cli.options.filename);
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
    switch(code) {
        case 0:
            cli.spinner(spinner, true);
            console.log(g('✔'), `${cli.options.filename}`);
            if (cli.options.open) {
                open(cli.options.filename);
            }
            break;
        case 128:
            cli.spinner(spinner, true);
            throw new Error('Dude, wake up, this is not a GIT repository...');
        default:
            throw new Error('Some weird shit happened, git exited with code: ' + code);
    }
}

/**
 * Prepares and validates options
 */
function prepareOptions() {
    var opts = cli.options;

    opts.since    = moment(opts.since, 'YYYY-MM-DD');
    opts.until    = moment(opts.until, 'YYYY-MM-DD');
    opts.filename = filename();

    [opts.since, opts.until].forEach((date) => {
        if (!date.isValid()) {
            throw new Error('Please provide dates in YYYY-MM-DD format.');
        }
    });

    if (!author()) {
        throw new Error('You need to provide --name or --email, or set your git name or email configuration.');
    }
    if (opts.until.isBefore(opts.since)) {
        throw new Error('This ain\'t no time machine pal, "until" date must be after "since" date.');
    }
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
        `--pretty=format:"${opts.format}"`
    ];
}

/**
 * Decide what to use for author parameter
 *
 * @return {String}         Git email or name
 */
function author() {
    return cli.options.email || cli.options.name || user.git.email || user.git.name;
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
    var name  = [unwrapScope(project()), 'samples', since, 'to', until].join('-').concat('.txt');

    return path.join(opts.dest, name);
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
        return process.cwd().split(path.sep).pop();
    }
}

/**
 * Replaces slash with dash if package is scoped
 *
 * @param {String} name
 * @return {String} Project name
 */
function unwrapScope(name) {
    var isScoped = name.indexOf('@') !== -1;
    return isScoped ? name.replace('/', '-') : name;
}
