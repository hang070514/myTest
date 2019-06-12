/**
 * Created by zhang on 2019/6/6.
 */
const fs = require('fs');

function read(url){
    return new Promise((resolve,reject)=>{
        fs.readFile(url,'utf8',(err,data) => {
            if(err)reject(err);
            resolve(data)
        })
    })
}

read('G:\\workspace\\myTest\\info.txt').then((data) => {
    return read(data);
}).then((data)=>{
    return read(data);
}).then((data)=>{
    console.log(data);
}).catch((err) => {
    console.log('err===',err);
})