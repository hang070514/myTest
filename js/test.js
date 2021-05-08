const express = require('express');
const app= express();

app.get('/', (req, res)=>{
    console.log('server is OK');
    res.end('jingjing')
});

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin",'http://localhost:63342');
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers", 'Content-Type,Content-Length,Authorization, Accept,X-Requested-With');
	res.header("Access-Control-Allow-Methods", 'PUT,POST,GET,DELETE,OPTIONS,HEAD');
	req.method === 'OPTIONS' ? res.send('CURRENT SERVICES SUPPORT CROSS DOMAIN REQUESTS!') : next();
});

app.listen(8081, ()=>{
    console.log('Server is running at http://localhost:8081')
})
