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
    try {
        exector(resolve,reject)
    }catch (e) {
        reject(e)
    }

}

Promise.prototype.then = function(onFulfiled,onRejected) {
    let self = this
    let promise2 = new Promise((resolve,reject) => {
        if (self.status === 'fulfillled') {
            setTimeout(() => {
                try {
                    let x = onFulfiled(self.value)
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
            self.onFulfilledCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = onFulfiled(self.value)
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

/*
promise2 then的返回值，返回新的promise
x then中成功函数或者失败函数的返回值
* */
function resolvePromise(promise2,x,resolve,reject) {
    // 限制既调resolve 又调reject
    let called
    if (promise2 === x) {
        // 自己等待自己完成  永远也完不成
        return reject(new TypeError('循环引用错误'))
    }

    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then
            // x.then还是函数  说明x是promise
            if (typeof then === 'function') {
                then.call(x,(y) => {
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
        resolve(x)
    }
}

Promise.resolve = function (val) {
    return new Promise((resolve,reject)  => {
        resolve(val)
    })
}

Promise.reject = function (val) {
    return new Promise((resolve,reject)  => {
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
        function processData(index,data){
            arr[index] = data
            if (++i === promises.length) {
                resolve(arr)
            }
        }

        for(let i = 0; i < promises.length; i++){
            promises[i].then((data) => {
                processData(i,data)
            },reject)
        }
    })
}

Promise.race =  function(promises){
    return new promise((resolve,reject) => {
        for(let i = 0; i < promises.length; i++){
            promises[i].then(resolve,reject)
        }
    })
}
