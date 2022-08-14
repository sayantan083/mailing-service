require('dotenv').config()
const express = require('express')
const router = require('./router/router')
const task = require('./helpers/cronScheduler')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', router);

task.start()

app.listen(port, () => {
  console.log(`Mail service app listening on port ${port}`)
})