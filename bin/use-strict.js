var parseArgs = require('minimist');
require('colors');

var args = parseArgs(process.argv.slice(2));

var options = [
    {
        name: 'help',
        description: 'Help for using this command',
    },
    {
        name: 'remove',
        description: 'Remove "use strict" statements',
    },
    {
        name: 'prefer',
        description: 'Preferred "use strict" statement (e.g. \'"use strict";\')',
    }
];

if (args['help']) {
    var maxLen = 0;
    options.forEach(function(option) {
        if (option.name.length > maxLen) {
            maxLen = option.name.length;
        }
    });

    console.log('Usage: use-strict [dir1] [dir2] [dirX] [--remove] [--prefer usestrict_statement]');
    options.forEach(function(option) {
        console.log('  --' + option.name.bold + ': ' + option.description.gray);
    });

    process.exit(0);
}

require('../').run({
    remove: args['remove'],
    prefer: args['prefer'],
    dir: args['_']
});