function Promise(exector) {
    let self = this
    self.status = 'pending'
    self.value = undefined
    self.reason = undefined
    self.onFulfilledCallbacks = []
    self.onRejectedCallbacks = []

    function resolve(value) {
        if (self.status === 'pending') {
            self.status = 'resolved'
            self.value = value
            onFulfilledCallbacks.forEach((fn) => {
                fn()
            })
        }
    }

    function reject(reason){
        if (self.status === 'pending') {
            self.status = 'rejected'
            self.reason = reason
            onRejectedCallbacks.forEach((fn) => {
                fn()
            })
        }
    }

    try {
        exector(resolve,reject)
    }catch (e) {
        reject(e)
    }
}

Promise.prototype.then = function (onFulfilled,onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected :  err => { throw err }
    let self = this
    let promise2 = new Promise((resolve,reject) => {
        if (self.status === 'resolved') {
            try {
                setTimeout(() => {
                    let x = onFulfilled(self.value)
                    resolvePromise(promise2,x,resolve,reject)
                },0)
            }catch (e) {
                reject(e)
            }
        }
        if (self.status === 'rejected') {
            try {
                setTimeout(() => {
                    let x = onRejected(self.reason)
                    resolvePromise(promise2,x,resolve,reject)
                },0)
            }catch (e) {
                reject(e)
            }
        }
        if (self.status === 'pending') {
            self.onFulfilledCallbacks.push(() => {
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
                })
            })
        }
    })
    return promise2
}

/**
 *
 * @param promise2  then 返回的新的promise
 * @param x  成功或失败函数返回的结果
 * @param resolve
 * @param reject
 */
function resolvePromise(promise2,x,resolve,reject) {
    let called
    if (promise2 === x) {
        reject(throw new TypeError('循环引用错误'))
    }
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(x,y => {
                    if (called) return
                    called = true
                    resolvePromise(promise2,y,resolve,reject)
                },err => {
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
