#!/usr/bin/env node
'use strict';
var fs = require('fs');
var exec = require('child_process').exec;
var program = require('commander');
var gitData = {
    username: require('git-user-name')(),
    email: require('git-user-email')()
};
//git log -p --all --no-merges --since="$(date +%Y)-$(($1-1))-18T16:08:41+00:00" --until="$(date +%Y)-$1-18T16:08:41+23:59" --reverse --author=$2 --pretty=format:"%h%x09%an%x09%ad%x09%s" > ~/PKUP/$2-samples-$(date +%Y)-$1.txt
program
    .version('0.0.1')
    .usage('gen [options]')
    .description('Generate PKUP samples')
    .option('-e, --email <email>', 'Your git email')
    .option('-u, --username <username>', 'Your git username')
    .option('-d, --dir <file>', 'Output dir name')
    .parse(process.argv);

pkup();

function pkup() {
    var email = userdata('email');
    var username = userdata('username');
    var outdir = output();

    if (!username || !email) {
        console.log('We could not determine your git user information');
        console.log('You must provide either a git name or email');
        process.exit(1);
    }
    log();
}

function log() {
    exec('git log', function(err, sto, ste) {
        console.log(err, sto, ste);
    });
}

function userdata(option) {
    return program[option] ? program[option] : gitData[option];
}

function output() {
    return program.dir ? program.dir : require('user-home');
}
