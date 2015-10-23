use-strict-cli
==============
This command line tool can be used to add or remove `'use strict';`
from all JavaScript files within a directory.

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

**Options:**
- `--remove`: Remove `'use strict'` statements

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