#!/usr/bin/env node
'use strict';
process.chdir(process.cwd());

var fs = require('fs');
var path = require('path');
var moment = require('moment');
var home = require('user-home');
var program = require('commander');
var exec = require('child_process').execSync;

var gitData = {
    username: require('git-user-name')(),
    email: require('git-user-email')(),
};

program
    .version('0.0.1')
    .usage('[options]')
    .description('Generate PKUP samples')
    .option('-e, --email <email>', 'Your git email, [#]'.replace('#', gitData.email))
    .option('-u, --username <username>', 'Your git username, [#]'.replace('#', gitData.username))
    .option('-d, --dir <directory>', 'Output directory name, [#]'.replace('#', home))
    .parse(process.argv);

pkup();

function pkup() {
    program.dir = output();
    program.user = userdata();

    if (!program.user) {
        console.log('We could not determine your git user information');
        console.log('You must provide either a git name or email');
        process.exit(1);
    }

    write(log());
}

function write(diff) {
    var filename = [
        'pkup',
        project(),
        'samples',
        moment().format('YYYY-MM'),
    ].join('-').concat('.txt');

    fs.writeFile(path.join(program.dir, filename), diff, 'utf8', function(err) {
        if(err) {
            console.log(err);
        }
        console.log(path.join(program.dir, filename));
        console.log('PKUP sample generated successfully');
    });
}

function log() {
    var d = moment().date(18).hour(17).minute(0).second(0).utcOffset(0);
    var until = d.format();
    var since = d.subtract(1, 'month').format();
    var cmd = [
        'git',
        'log',
        '-p',
        '--all',
        '--no-merges',
        `--since="${since}"`,
        `--until="${until}"`,
        '--reverse',
        `--author="${program.user}"`,
        '--pretty=format:"%h%x09%an%x09%ad%x09%s"',
    ].join(' ');

    return exec(cmd);
}

function output() {
    return program.dir ? program.dir : home;
}

function project() {
    try {
        return require(path.join(process.cwd(), 'package.json')).name;
    } catch(e) {
        return 'project';
    }
}

function userdata() {
    var email = check('email');
    var username = check('username');
    if(!email || !username) {
        console.log('Could not determine your user information');
    }

    function check(option) {
        return program[option] ? program[option] : gitData[option];
    }

    return email || username;
}
