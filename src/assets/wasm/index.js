const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))
app.use((req, res, next) => {
  res.set({'Access-Control-Allow-Origin':'*'});
  next();
})

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})