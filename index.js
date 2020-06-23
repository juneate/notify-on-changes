const screenshot = require("node-server-screenshot")
const compare = require('looks-same')
const notifier = require('node-notifier')
const fs = require('fs')
const path = `./img/`

const moveFileToOld = () => {
	try { 
		fs.renameSync(`${path}new.png`, `${path}prev.png`) 
	} catch (e) { 
		console.error(e) 
	}
}

// Screenshot the site
	// If a previous version exists, compare
			// If different, email!
			// If the same, rename the new image to replace the prev image
	// If not, just rename

const checkSite = () => {
	screenshot.fromURL("https://hastingscorktown.resurva.com", `${path}new.png`, () => {

		try {
			if (fs.existsSync(`${path}prev.png`)) {
				compare(`${path}new.png`, `${path}prev.png`, (error, {equal}) => {
	
					if (!equal) {
						notifier.notify({
							'title': 'Hastings Barber Shop',
							'subtitle': 'Something has changed',
							'message': 'Site may now be open for appointment bookings',
							'icon': './img/hastings.jpeg',
							'contentImage': `${path}new.png`,
							'open': "https://hastingscorktown.resurva.com",
							'sound': 'Submarine',
							'wait': true
						})
						notifier.on('click', (obj, options) => {
							clearInterval(interval)
						})
					} else {
						console.log(`Nothing yet.`)
						moveFileToOld()
					}
				})
			} else {
				moveFileToOld()
			}
		} catch(e) {
			console.error(e)
		}
	})
}

let interval = setInterval(checkSite, 7000)
