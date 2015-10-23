var parseArgs = require('minimist');
var args = parseArgs(process.argv.slice(2));

require('../').run({
    remove: args['remove'],
    dir: args['_']
});