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
├── .ashproject            # Lets you customize your Ash in it, very important.
├── assets/                # Static files (images, gifs, etc.)
├── src/                   # Source code files (compiled alphabetically).
├── lib/                   # Libraries such as commands.js, OpenBundles, BetterBundles, etc.
│   └── commands.js        # Commands used by your code, like BEMA and onEvent.
├── combine-scripts.js     # Merges scripts for final build, don't run on its own.
├── index.html             # Main HTML entry point
├── build.js               # Compilation script
├── package.json           # Project metadata & dependencies
├── package-lock.json      # Dependency lockfile (exact versions)
├── README.md              # Project documentation
├── styles.css             # Global CSS styling
└── webpack.config.js      # Webpack config for bundling/compiling
```
