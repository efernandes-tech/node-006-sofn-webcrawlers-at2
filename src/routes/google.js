const express = require('express')
const router = express.Router()

const request = require('request')
const cheerio = require('cheerio') // jQuery

router.get('/', (req, res) => {
    request('https://www.google.com/search?q=school+of+net&oq=school+of+net', (error, response, body) => {
        if (error || response.statusCode != 200) {
            return;
        }

        let $ = cheerio.load(body)
        let data = []

        $('.ZINbbc').each((index, element) => {
			let header = $(element).find('.vvjwJb').html()
			let link   = $(element).find('.UPmit').html()

            data.push({
                header,
                link
            })
        })

        // res.send(body)

		return res.status(200)
			.json(data)
    })
})

module.exports = router