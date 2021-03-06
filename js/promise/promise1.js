class promise{
    constructor(executor){
        this.status = 'pending'
        this.value = undefined
        this.reason = undefined
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []
        let resolve = value => {
            if (this.status === 'pending') {
               this.status = 'fulfilled'
               this.value = value
                this.onResolvedCallbacks.forEach(fn=> fn())
            }
        }
        let reject = reason => {
           if (this.status === 'pending') {
              this.status = 'rejected'
              this.reason = reason
               this.onRejectedCallbacks.forEach(fn=> fn())
           }
        }
        try {
           executor(resolve,reject)
        }catch (e) {
            reject(e)
        }
    }
    then(onFulfilled,onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        onRejected = typeof  onRejected === 'function' ? onRejected : err => {throw err}
        let promise2 = new Promise((resolve,reject) => {
            if (this.status == 'fulfilled') {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch (e) {
                      reject(e)
                    }
                },0)

            }
            if (this.status == 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (e) {
                       reject(e)
                    }
                },0)
            }
            if (this.status == 'pending') {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2,x,resolve,reject)
                        }catch (e) {
                           reject(e)
                        }
                    },0)
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2,x,resolve,reject)
                        } catch (e) {
                            reject(e)
                        }
                    },0)
                })
            }
        })
        return promise2
    }
}

function resolvePromise(promise2,x,resolve,reject) {
    if (x === promise2) {
        return reject(new TypeError("Chaining cycle detected for promise"))
    }
    let called
    if (x != null && (typeof x == 'object' || typeof x == 'function')) {
        try {
            let then = x.then
            if (typeof then == 'function') {
                then.call(x, y=> {
                    if (called) return
                    called = true
                    resolvePromise(promise2,y,resolve,reject)
                }, err => {
                    if (called) return
                    called = true
                    reject(err)
                })
            } else {
                resolve(x)
            }
        }catch (e) {
            if(called) return
            called = true
        }
    } else {
        resolve(x)
    }
}
