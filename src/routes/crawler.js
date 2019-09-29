const express = require('express')
const router = express.Router()

const request = require('request')
const cheerio = require('cheerio')

router.get('/', (req, res) => {
    res.render('crawler/index', {
        title: 'Web Crawler',
        msg: 'Welcome to Web Crawler'
    })
})

router.post('/', (req, res) => {
	if ( ! req.body.search_term) { // Se não recebeu o termo para pesquisa.
		return res.redirect('/')
	}

	let search_term = req.body.search_term.split(' ').join('+')

	request(`https://www.google.com.br/search?q=${search_term}&oq=${search_term}`, (error, response, body) => {
		if (error || response.statusCode != 200) {
			return res.redirect('/')
		}

		let $    = cheerio.load(body)
		let data = []

		$('.ZINbbc').each((index, element) => {
			let header = $(element).find('.vvjwJb').html()
			let link   = 'https://www.google.com/' + $(element).find('.UPmit').html()

            data.push({
                header,
                link
            })
        })

		if (!data.length) {
			return res.redirect('/')
		}

        req.session.result_data = data

		return res.redirect('/result')
	})
})

router.get('/result', (req, res) => {
	let result = req.session.result_data

	req.session.result_data = []

	return res.render('crawler/result', {
		data: result
	})
})

module.exports = router
