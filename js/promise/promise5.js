// 定义三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
function MyPromise(exector) {
    let self = this
    self.vale = null
    self.reason = null
    self.status = PENDING
    // 成功的回调函数
    self.onFulfilledCallbacks = []
    // 失败的回调函数
    self.onRejectedCallbacks = []

    function resolve(value) {
        setTimeout(() => {
            self.status = FULFILLED
            self.value = value
            self.onFulfilledCallbacks.forEach((fn) => {
                fn()
            })
        },0)
    }

    function reject(reason){
        setTimeout(() => {
            self.status = REJECTED
            self.reason = reason
            self.onRejectedCallbacks.forEach((fn) => {
                fn(self.reason)
            })
        },0)
    }
    exector(resolve,reject)
}

MyPromise.prototype.then = function (onFulFilled,onRejected) {
    let self = this

    onFulFilled = typeof  onFulFilled === 'function' ? onFulFilled : value => value
    onRejected = typeof  onRejected === 'function' ? onRejected : error => {throw error}

    let promise2 = new MyPromise((resolve,reject) => {
        if(self.status === FULFILLED) {
            setTimeout(() => {
                try {
                    let x = onFulFilled(self.value)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            },0)
        }
        if (self.status === REJECTED) {
            setTimeout(() => {
                try {
                    let x = onRejected(self.reason)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                   reject(e)
                }
            },0)
        }

        if (self.status === PENDING) {
            self.onFulfilledCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = onFulFilled(self.value)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch (e) {
                        reject(e)
                    }
                },0)
            })
            self.onRejectedCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = reject(self.reason)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch(e) {
                        reject(e)
                    }
                })
            })
        }
    })
    return promise2;
}

function resolvePromise(promise2,x,resolve,reject){
    if (promise2 === x) {
        return reject(new TypeError('不能等于自身'))
    }
    let called
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(x,y=> {
                    if (called) return
                    called = true
                    resolvePromise(promise2,y,resolve,reject)
                }, (err) => {
                    if (called) return
                    called = true
                    reject(err)
                })
            } else {
                resolve(x)
            }
        }catch (e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        // x 为一个常量 则走resolve
        resolve(x)
    }
}
/*let fs = require('fs')
let readFilePromise = (filename) => {
    return new MyPromise((resolve,reject) => {
        fs.readFile(filename, (err,data) => {
            if (!err){
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}*/

/*readFilePromise('1.txt').then(data => {
    console.log(data.toString())
    return readFilePromise('2.txt')
}).then(data => {
    console.log(data.toString())
})*/
/*readFilePromise('./1.txt').then(data => {
    console.log(data.toString())
    return readFilePromise('./2.txt')
}).then(data => {
    console.log(data.toString())
})*/
