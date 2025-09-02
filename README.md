# Ash

Welcome to **Ash**, my code framework doohicky, powered by Node.js and browser js.

## Getting Started

To get up and running:

1. Clone the repo and `cd` into the project directory.
2. Install dependencies:

```bash
npm i
```

## Project Structure

* All source files live in `/src/`.
* Files are compiled alphabetically.

## Building

To compile your project after any change, simply run:

```bash
node ./build.js all
```

This will build your `/src/` contents and assets.


To compile your project after any code change, simply run:

```bash
node ./build.js 
```

This will build only your `/src/` contents, copies faster!


It will be output to `/index/`

---

## Project Structure
```txt
Ash/
├── assets/                # Static files (images, gifs, etc.)
├── brain.png              # Required for BEMA, ignore it.
├── combine-scripts.js     # Merges scripts for final build, don't run on its own.
├── commands.js            # Commands that your code use, like BEMA and onEvent.
├── index.html             # Main HTML entry point
├── build.js                # Compilation script, to run see above.
├── openbundles.js         # More commands that your code use.
├── package.json           # Project metadata & dependencies.
├── package-lock.json      # Dependency lockfile (exact versions).
├── README.md              # Project documentation.
├── src/                   # Source code files (compiled alphabetically).
├── styles.css             # Global CSS styling.
├── .ashproject            # Tells ash that what its running is made for Ash, also can customize your Ash in it!
└── webpack.config.js      # Webpack config for bundling/compiling.
```
