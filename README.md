# Ash

Welcome to Ash, my code framework doohicky, powered by Node.js and browser js.

## Getting Started

To start:

1. Clone the repo and `cd` into the project folder.
2. Install dependencies:

```bash
npm i
```

## .ashproject

```json
{
    "name": "MyCoolAshProject",
    "platform": "phone"
}
```
* Handles configuration of project.
* Name handles,,, the name,,, To read from it use window.projectName.
* Platform can be "phone", "desktop", or "corg". It changes the screen aspect ratio. To read from it use window.currentPlatform.

## Project Structure

* All source files live in `/src/`.
* Files are compiled after libraries, all alphabetically.


## Building

To compile your project after big any change, simply run:

```bash
node build all
```

This will build your `/src/` contents and assets.


To compile your project after any code change, simply run:

```bash
node build
```

This will build only your `/src/` contents, copies faster!
Usually copying using `all` is not neccessary besides first startup.


It will be output to `/index/` which you can distribute and run from.

---

## Project Structure
```txt
Ash/
├── .ashproject            # Lets you customize your Ash project in it, very important.
├── assets/                # Any static files you need your your project.
├── src/                   # Source code files (compiled alphabetically).
├── lib/                   # Libraries such as commands.js, aes256, AEA, etc.
│   └── commands.js        # Required library, provides commands like onEvent.
├── plugins/               # Build-level plugins.
│   └── add-log.js         # Sample plugin.
├── combine-scripts.js     # Merges scripts for final build, don't run on its own.
├── index.html             # Main HTML entry point.
├── build.js               # Compilation script.
├── package.json           # Project metadata & dependencies.
├── package-lock.json      # Dependency lockfile (exact versions).
├── README.md              # Project documentation.
├── styles.css             # Global CSS styling, do NOT modify, use a build plugin.
└── webpack.config.js      # Webpack config for bundling/compiling.
```
