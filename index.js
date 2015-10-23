require('colors');

var path = require('path');
var fs = require('fs');
var directoryWalker = require('directory-walker');
var series = require('raptor-async/series');

var jsRegex = /\.js$/;

function processFiles(files, options) {
    var remove = options.remove;

    files.forEach(function(file) {
        var contents = file.contents;

        if (remove) {
            var match = file.match;
            var occurrences = [];

            do {
                occurrences.push([match.index, match[0]]);
            } while((match = file.regex.exec(contents)) !== null);

            var i = occurrences.length;
            while(--i >= 0) {
                var occurrence = occurrences[i];
                var pos = occurrence[0];
                var str = occurrence[1];
                contents = contents.substring(0, pos) + contents.substring(pos + str.length);
            }
        } else {
            contents = options.prefer + '\n\n' + contents;
        }

        fs.writeFileSync(file.absolutePath, contents, {encoding: 'utf8'});
    });
}

exports.run = function(options) {
    options.prefer = options.prefer || '\'use strict\';';

    var dir = options.dir || process.cwd();

    var work = [];

    if (!Array.isArray(dir)) {
        dir = [dir];
    }

    if (dir.length === 0) {
        dir.push(process.cwd());
    }

    for (var i = 0; i < dir.length; i++) {
        dir[i] = path.resolve(process.cwd(), dir[i]);
    }

    console.log('\nScanning following directories or files:');
    console.log(dir.map(function(dir) {
        return (' - ' + dir).gray + '\n';
    }).join(''));
    console.log();

    var files = [];
    var remove = options.remove = (options.remove === true);

    function onFile(file, dir) {
        if (jsRegex.test(file)) {
            var fileRelativePath = dir ? file.substring(dir.length + 1) : file;
            var contents = fs.readFileSync(file, {encoding: 'utf8'});
            var regex = /(?:\'use strict\'|\"use strict\");?(\r?\n)+/g;
            var match = regex.exec(contents);

            if ((match && remove) || (!match && !remove)) {
                files.push({
                    absolutePath: file,
                    relativePath: fileRelativePath,
                    match: match,
                    contents: contents,
                    regex: regex
                });
            }
        }
    }

    dir.forEach(function(dir) {
        var stat = fs.statSync(dir);
        if (stat.isFile()) {
            onFile(dir, stat);
        } else {
            work.push(function(callback) {
                directoryWalker.create()
                    .onFile(function(file, stat) {
                        onFile(file, dir);
                    })

                    .onComplete(function() {
                        callback();
                    })

                    .walk(dir);
            });
        }
    });

    series(work, function(err) {
        if (!files.length) {
            console.log('No files need to be updated.');
            return;
        }

        if (remove) {
            console.log('"use strict" statement will be removed from the following files:');
        } else {
            console.log(options.prefer + ' will be added to the following files:');
        }

        console.log(files.map(function(file) {
            return (' - ' + file.relativePath).green + '\n';
        }).join(''));

        console.log('');

        var prompt = require('prompt');
        prompt.message = '';
        prompt.delimiter = '';

        //
        // Start the prompt
        //
        prompt.start();

        //
        // Get two properties from the user: username and email
        //
        prompt.get([{
            name: 'answer',
            description: 'Continue?',
            required: true,
            default: 'yes'
        }], function (err, result) {
            var answer = result.answer.toLowerCase();
            if ((answer === 'y') || (answer === 'yes')) {
                processFiles(files, options);
            } else {
                console.log('Operation canceled'.red);
            }
        });
    });
};