function Promise(executor){
    let self = this
    self.value = undefined
    self.reason = undefined
    self.stats = 'pending'
    self.onResolvedCallbacks = []
    self.onResolvedCallbacks = []
    // 声明一个resolve方法
    function resolve(value) {
        if (self.status == 'pending') {
            self.value = value
            // 当调用resolve时，更改状态为resolved
            self.status = 'resolved'
            self.onResolvedCallbacks.forEach(fn => fn())
        }
    }

    // 声明一个reject方法
    function reject(reason) {
        if (self.status == 'pending') {
            self.reason = reason
            // 当调用reject时，更改状态为rejected
            self.status = 'rejected'
            self.onRejectedCallbacks.forEach(fn=> fn())
        }
    }
    try {
        executor(resolve,reject)
    }catch (e) {
        reject(e)
    }

}

Promise.prototype.then = function (onFulfilled,onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}
    let promise2 = new Promise((resolve,reject) => {
        // 首先判断目前处于什么状态
        if (self.status == 'resolved') {
            setTimeout(() => {
                try {
                    let x = onFulfilled(self.value)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            },0)
        }
        if (self.status == 'rejected') {
            setTimeout(() => {
                try {
                    let x = onRejected(self.reason)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            },0)
        }

        if (self.status == 'pending') {
            self.onResolvedCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self.value)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch (e) {
                        reject(e)
                    }
                },0)
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

function resolvePromise(promise2,x,resolve,reject){
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected promise'))
    }
    let called
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            // 如果x为promise的话，是存在then方法的
            let then = x.then
            if (typeof then === 'function') {
                then.call(x,y => {
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
    }else {
        //  x为一个常量  则走resolve成功
        resolve(x)
    }
}
