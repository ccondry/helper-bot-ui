const express = require('express')
const app = express()
const fs = require('fs')

// serve files out of ./dist/
app.use(express.static('dist'))

// on 404, send index.html for Vue single page app
app.use(function (req, res, next) {
  try {
    const content = fs.readFileSync('dist/index.html', 'utf-8')
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    })
    res.end(content)
  } catch (err) {
    console.log('could not open "index.html" file:', err.message)
  }
})

// start http on port 8000
app.listen('8000', () => console.log(`Express.js app listening on port 8000`))
