
//定义三种状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(executor) {
    let self = this; // 缓存当前promise实例
    self.value = null;
    self.error = null;
    self.status = PENDING;
    self.onFulfilledCallbacks = []; //成功的回调函数
    self.onRejectedCallbacks = []; //失败的回调函数

    const resolve = (value) => {
        if(self.status !== PENDING) return;
        setTimeout(() => {
            self.status = FULFILLED;
            self.value = value;
            self.onFulfilledCallbacks.forEach((fn) => {
                fn(self.value)
            });//resolve时执行成功回调
        });
    };

    const reject = (error) => {
        if(self.status !== PENDING) return;
        setTimeout(() => {
            self.status = REJECTED;
            self.error = error;
            self.onRejectedCallbacks.forEach((fn) => {
                fn(self.error)
            });//resolve时执行成功回调
        });
    };
    executor(resolve, reject);
}
MyPromise.prototype.then = function(onFulfilled, onRejected) {
    let promise2
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : error => {throw error}
    if (this.status === PENDING) {
        return promise2 = new MyPromise((resolve,reject) => {
            this.onFulfilledCallbacks.push((value) => {
                try {
                   let x = onFulfilled(value)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            });
            this.onRejectedCallbacks.push(error => {
                try {
                    let x = onRejected(error)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            });
        })

    } else if (this.status === FULFILLED) {
        //如果状态是fulfilled，直接执行成功回调，并将成功值传入
        let promise2 = new MyPromise((resolve,reject) => {
            setTimeout(() => {
                try {
                    let x = onFulfilled(this.value)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            },0)
        })

    } else {
        //如果状态是rejected，直接执行失败回调，并将失败原因传入
        let promise2 = new MyPromise((resolve,reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(this.reason)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            },0)
        })
    }
    return this;
}

function resolvePromise(promise2,x,resolve,reject){
    if (x instanceof MyPromise) {
        if (x.status === PENDING) {
            x.then(y=> {
                resolvePromise(promise2,y,resolve,reject)
            },err => {
                reject(err)
            })
        } else {
            x.then(resolve,reject)
        }
    } else {
        resolve(x)
    }
}
let fs = require('fs')
let readFilePromise = (filename) => {
    return new MyPromise((resolve,reject) => {
        fs.readFile(filename,(err,data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

readFilePromise('1.txt').then(data  => {
    console.log(data.toString())
    return readFilePromise('2.txt')
}).then(data => {
    console.log(data.toString())
})
