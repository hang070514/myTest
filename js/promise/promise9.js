function Promise(exector) {
    let self = this
    self.status = 'pending'
    self.value = undefined
    self.reason = undefined
    self.onFulfilledCallbacks = []
    self.onRejectedCallbacks = []

    function resolve(value) {
        if (self.status === 'pending') {
            self.value = value
            self.status = 'fulfilled'
            self.onFulfilledCallbacks.forEach((fn) => {fn()})
        }
    }

    function reject(reason) {
        if (self.status === 'pending') {
            self.reason = reason
            self.status = 'rejected'
            self.onRejectedCallbacks.forEach((fn) => {fn()})
        }
    }

    exector(resolve,reject)
}

Promise.prototype.then = function (onFulfilled,onRejected) {
    let  self = this
    let promise2 = new Promise((resolve,reject) => {
        if (self.pending === 'fulfilled') {
            setTimeout(() => {
                try {
                    let x = onFulfilled(self.value)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            },0)

        }

        if (self.pending === 'rejected') {
            setTimeout(() => {
                try {
                    let x = onRejected(self.reason)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            },0)

        }

        if (self.pending === 'pending') {
            self.onFulfilledCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self.value)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch (e) {
                       reject(e)
                    }
                },0)

            })
        }

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
    })
    return promise2
}
/*
* promise2  then方法返回的新的promise
* x  then中  onFulfilled或onRejected返回值
*
* */
function resolvePromise(promise2,x,resolve,reject) {
    // 防止既调成功方法又调失败方法
    let called
    if (promise2 === x) {
        return reject(new TypeError('循环引用错误'))
    }

    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then
            // 如果x.then还是方法  则x就是promis
            if (typeof then === 'function') {
                then.call(x, (y) => {
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
        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}

Promise.resolve = function (val) {
    return new Promise((resolve,reject) => {
        resolve(val)
    })
}

Promise.reject = function (val) {
    return new Promise((resolve,reject) => {
        reject(val)
    })
}

Promise.prototype.catch = function (onRejected) {
    return this.then(null,onRejected)
}

Promise.all = function (promises) {
    return new Promise((resolve,reject) => {
        let arr = []
        let i = 0

        function processData(index,data) {
            arr[index] = data
            if (++i === promises.length) {
                resolve(arr)
            }
        }

        for (let i = 0; i < promises.length; i++){
            promises[i].then((data) => {
                processData(i,data)
            },reject)
        }
    })
}

/*Promise.race = function (promises) {
    return new Promise((resolve,reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(resolve,reject)
        }
    })
}*/


