function  Promise(exector) {
    let self = this;
    self.status = 'pending'
    self.value = undefined
    self.reason = undefined
    self.onFilfilledCallbacks = []
    self.onRejectedCallbacks = []
    function resolve(value) {
        if (self.status === 'pending') {
            self.status = 'fulfilled'
            self.value = value
            self.onFilfilledCallbacks.forEach((fn) => {
                fn()
            })
        }
    }

    function reject(reason) {
        if (self.status === 'pending') {
            self.status === 'rejected'
            self.reason = reason
            self.onRejectedCallbacks.forEach((fn) => {
                fn()
            })
        }
    }

    try{
        exector(resolve,reject)
    }catch (e) {
        reject(e)
    }
}

Promise.prototype.then = function (onFulfilled,onRejected) {
    let self = this
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}
    let promise2 = new Promise((resolve,reject) => {
        if (self.status === 'fulfillled') {
            setTimeout(() => {
                try {
                    let x = onFulfilled(self.value)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            },0)
        }
        if (self.status === 'rejected') {
            setTimeout(() => {
                try {
                    let x = onRejected(self.reason)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            },0)
        }

        if (self.status === 'pending') {
            self.onFilfilledCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self.value)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch (e) {
                        reject(e)
                    }
                })
            })
            self.onRejectedCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = onRejected(self.reason)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch (e) {
                        reject(e)
                    }
                },0)
            })
        }
    })
    return promise2
}

function resolvePromise(promise2,x,resolve,reject) {
    // 防止多次调用
    let called
    if (promise2 === x) {
        // 自己等待自己完成  永远也完不成
        return reject(new TypeError('循环引用错误'))
    }
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return
                    called = true
                    resolvePromise(promise2,y,resolve,reject)
                    },
                    (err) => {
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
        // 常量直接resolve
        resolve(x)
    }
}

// resolve方法
Promise.resolve = function (val) {
    return new Promise((resolve,reject) => {
        resolve(val)
    })
}

// reject方法
Promise.reject = function (val) {
    return new Promise((resolve,reject) => {
        reject(val)
    })
}

// catch方法
Promise.prototype.catch = function (onRejected) {
    return this.then(null,onRejected)
}

// all 方法
Promise.all = function (promises) {
    return new Promise((resolve,reject) => {
        let arr = []
        let i = 0
        function processData(index,data){
            arr[index] = data
            if (++i === promises.length) {
                resolve(arr)
            }
        }
        for(let i = 0; i < promises.length; i++){
            promises[i].then(data => {
                processData(i,data)
                },
                reject)
        }
    })
}
// race 方法
Promise.race = function (promises) {
    return new Promise((resolve,reject) => {
        for(let i =0; i < promises.length; i++){
            promises[i].then(resolve,reject)
        }
    })
}
