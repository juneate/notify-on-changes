const screenshot = require('capture-website')
const compare = require('looks-same')
const notifier = require('node-notifier')
const fs = require('fs')
const path = `./img/`
const url = 'https://hastingscabbagetown.resurva.com'
const interval = 5 * 60000 // 5 mins
let timeout

console.log = console.log.bind(console, `${new Date().toLocaleTimeString()}:`)

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

	(async () => {
		console.log(`Requesting screenshot`)
		
		try {
			await screenshot.file(url, `${path}new.png`)
		} catch (e) {
			console.error(e)
			// Does an error resolve the promise and hit the "then"?
		}
	})().then(() => {
		try {
			if (fs.existsSync(`${path}prev.png`)) {
				console.log(`Comparing for changes`)
				compare(`${path}new.png`, `${path}prev.png`, (error, {equal}) => {

					// They're different, something has changed
					if (!equal) {
						console.log(`Something has changed!`)
						notifier.notify({
							'title': 'Hastings Barber Shop',
							'subtitle': 'Something has changed',
							'message': 'Site may now be open for appointment bookings',
							'icon': './img/hastings.jpeg',
							'contentImage': `${path}new.png`,
							'open': url,
							'sound': 'Submarine',
							'wait': true
						})
						notifier.on('click', (obj, options) => {
							clearTimeout(timeout)
						})
						
						// Delete file, but don't replace 'prev.png' since that's the old screenshot (keeps alert going)
						try {
							fs.unlinkSync(`${path}new.png`)
						} catch(e) {
							console.error(e)
						}

					} else {
						console.log(`Nothing yet`)
						moveFileToOld()
					}
				})
			} else {
				console.log(`Storing first screenshot`)
				moveFileToOld()
			}
			setTimeout(checkSite, interval)
		} catch(e) {
			console.error(e)
		}

	})
}


checkSite()
