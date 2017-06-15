# sb-pngsqueeze - Starbound mod helper

sb-pngsqueeze is a node.js utility designed to assist with compressing PNG assets used in Starbound mods to (seriously!) save on space.

## installation

Install the latest version of node.js, then open a command prompt window as an administrator and run:

	npm install --global --production windows-build-tools

This is necessary in order to handle the Windows build toolchain for the excellent [sharp](https://github.com/lovell/sharp/) library that's used to handle PNG compression.

Afterwards, run:

    npm install damianb/sb-pngsqueeze

Then, create a small stub file (of your own naming) to call the module.

## usage

Just call the exported function - see the example below.

	let sbPNGSqueeze = require('sb-pngsqueeze')
	sbPNGSqueeze({
		modDir: 'D:\\code\\starbound\\sbmods\\AsteroidOres\\src',
	}, function(errors) {
		console.log('Done running sb-pngsqueeze')
	})

The only arguments taken by the module's function are as follows:

* **options**: a javascript object with any of the following properties:
* *options.modDir*: the filesystem location where your mod's files live (basically where the _metadata file is).


* **callback**: a javascript callback fired when the utility is complete.

And that's it!  Run the js, and you'll get your mod's asset files crushed down in size.  I recommend using version control to keep track of the previous versions of your mod's assets, however.

## todo

CLI utility for crushing everything in current directory.  Would be helpful.