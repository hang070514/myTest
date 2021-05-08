function Promise(exector){
    let self = this
    self.status = 'pending'
    self.value = undefined
    self.reason = undefined
    self.onFulfilledCallbacks = []
    self.onRejectedCallbacks = []

    function resolve(value){
        if (self.status === 'pending') {
            self.status = 'resolved'
            self.value = value
            self.onFulfilledCallbacks.forEach((fn) => {
                fn()
            })
        }
    }

    function reject(reason){
        if (self.status === 'pending') {
            self.status = 'rejected'
            self.reason = reason
            self.onRejectedCallbacks.forEach((fn) => {
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

Promise.prototype.then = function(onFulfilled,onRejected) {
    let promise2
    let self = this
    promise2 = new Promise((resolve,reject) => {
        if (self.status === 'fulfilled') {
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

function resolvePromise(promise2,x,resolve,reject) {
    let called
    if (promise2 === x) {
        return reject(new TypeError('循环引用错误'))
    }
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then
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
