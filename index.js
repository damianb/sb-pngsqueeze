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

	let evaluator = function(file, stats) {
		return stats.isFile() && (path.extname(file) !== '.png')
	}

	r_readdir(options.modDir, [evaluator], function(err, files) {
		if(err) throw err

		let promises = []
		files.forEach(function(filePath) {
			// sanity check
			if(!filePath.startsWith(options.modDir)) {
				return
			}

			// png file to crush!
			let p = sharp(filePath).png({ compression: 6 }).toFile(filePath + '.crushed')
			p.then((info) => {
				console.log('crushed ' + filePath + ' down to ' + info.size + ' bytes!')
			}, (err) => {
				console.error('failed to crush ' + filePath)
				console.error(err.stack)
			})
			promises.push(p)
		})
		
		Promise.all(promises).then(() => {
			let promises = []
			files.forEach(function(filePath) {
				// sanity check
				if(!filePath.startsWith(options.modDir)) {
					return
				}

				let p = fs.move(filePath + '.crushed', filePath, { overwrite: true })
				p.then((info) => {
					console.log('overwrote ' + filePath)
					return 
				}, (err) => {
					console.error('failed to overwrite ' + filePath)
					console.error(err.stack)
				})
				promises.push(p)
			})

			return Promise.all(promises)
		})
		.then(() => {
			if(!!callback) {
				callback()
			} else {
				process.exit(0)
			}
		})
	})
}