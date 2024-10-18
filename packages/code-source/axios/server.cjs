const express = require('express')


const app = express()

app.get('/list',(req, res) => {
    res.send([{name: '222'}])
})

app.listen(9000, () => {
    console.log('listen 9000 port, start.............');
    
})