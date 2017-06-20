//
// sb-pngsqueeze - Starbound mod helper - PNG asset file crushing
// ---
// @copyright (c) 2017 Damian Bushong <katana@odios.us>
// @license MIT license
// @url <https://github.com/damianb/>
// @reddit <https://reddit.com/u/katana__>
//
/*jslint node: true, asi: true */
"use strict"

let r_readdir = require('recursive-readdir')
let sharp = require('sharp')
let path = require('path')
let fs = require('fs-extra')
let os = require('os')

module.exports = function(options, callback) {
	if(!options.modDir) {
		throw new Error('mod source directory MUST be specified')
	}

	options.modDir += path.sep
	options.compression = parseInt(options.compression, 10) || 6

	let evaluator = function(file, stats) {
		let result = stats.isFile() && (path.extname(file) !== '.png')
		return result
	}

	r_readdir(options.modDir, [evaluator]).then((files) => {
		let promises = []
		files.forEach(function(filePath) {
			// sanity check
			if(!filePath.startsWith(options.modDir)) {
				return
			}

			// png file to crush!
			let p = sharp(filePath).png({ compression: options.compression }).toFile(filePath + '.crushed')
			p.catch((err) => {
				console.error('failed to crush ' + filePath)
				console.error(err.stack)
			})
			promises.push(p)
		})
		
		return Promise.all(promises).then(() => {
			return Promise.resolve(files)
		})
	}).then((files) => {
		let promises = []
		files.forEach(function(filePath) {
			// sanity check
			if(!filePath.startsWith(options.modDir)) {
				return
			}

			let p = fs.move(filePath + '.crushed', filePath, { overwrite: true })
			p.then(() => {
				return fs.stat(filePath)
			}).then((info) => {
				console.log('crushed ' + filePath + ' down to ' + info.size + ' bytes!')
			}).catch((err) => {
				console.error('failed to overwrite ' + filePath)
				console.error(err.stack)
			})

			promises.push(p)
		})

		return Promise.all(promises)
	}).then(() => {
		if(!!callback) {
			callback()
		} else {
			process.exit(0)
		}
	})
}