const fs = require('fs').promises;
const path = require('path');

async function combineScripts() {
	try {
		const baseDir = __dirname;
		const srcDirPath = path.join(baseDir, 'src');
		const combinedPath = path.join(baseDir, 'combined.js');

		const [commandsContent, openbundlesContent, srcFiles] = await Promise.all([
			fs.readFile(path.join(baseDir, 'commands.js'), 'utf8'),
			fs.readFile(path.join(baseDir, 'openbundles.js'), 'utf8'),
			fs.readdir(srcDirPath)
		]);

		const jsFiles = srcFiles.filter(f => f.endsWith('.js')).sort();
		const srcContents = await Promise.all(
			jsFiles.map(f => fs.readFile(path.join(srcDirPath, f), 'utf8'))
		);

		const parts = [
			'document.addEventListener("DOMContentLoaded", function() {',
			commandsContent,
			openbundlesContent,
		];

		for (let i = 0; i < jsFiles.length; i++) {
			parts.push(srcContents[i]);
		}

		parts.push('});');
		const combinedContent = parts.join('\n');

		await fs.writeFile(combinedPath, combinedContent, 'utf8');
		console.log('Scripts combined successfully.');
	} catch (error) {
		console.error('Error combining scripts:', error);
	}
}

combineScripts();
