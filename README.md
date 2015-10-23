use-strict-cli
==============
This command line tool can be used to add or remove `'use strict';`
from all JavaScript files within a directory. This tool is helpful
if you find yourself wanting to adopt new ES6 language features that
are only available if "use strict" statement is added to file.

For example, if you're trying to use `let` statements in Node.js 4
then you'll see this error if JavaScript file does not have "use strict":

`SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode`

## Installation

```bash
npm install use-strict-cli -g
```

## Usage

Command line help:
```bash
use-strict [dir1] [dir2] [dirX] [--remove]
```

All `*.js` files found within given directories and
their sub-directories will be scanned.

Before running this command line tool it is recommended
that you commit your current changes to source control
or create a backup in case there are any undesirable
changes.

**Options:**
- `--help`: Help on using this command
- `--remove`: Remove `'use strict'` statements
- `--prefer`: Preferred "use strict" statement (e.g. `"use strict";`)

**Add `'use strict';` to all files that do not already have it:**
```bash
use-strict ./src
```

**Remove `'use strict';` from all files that have it:**
```bash
use-strict ./src --remove
```

You will be prompted to confirm operation before changes will be saved.

## Example

```bash
cd ~/myproject
use-strict ./src

Scanning following directories:
- /Users/johndoe/myproject/src


"use strict" statement will be added to the following files:
- server.js
- cluster.js

Continue? (yes) yes
```