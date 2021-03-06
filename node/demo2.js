let fs = require('fs')

fs.readFile('1.txt',(err,data) => {
    console.log(data.toString())
    fs.readFile('2.txt',(err,data) => {
        console.log(data.toString())
    })
})
