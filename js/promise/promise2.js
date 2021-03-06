const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
function Promise(executor) {
    let self = this;
    self.status = PENDING
    self.onFulfilled = []
    self.onRejected = []

    function resolve(value) {
        if (self.status === PENDING) {
            self.status = FULFILLED
            self.value = value
            self.onFulfilled.forEach(fn => fn())
        }
    }
    function reject(reason) {
        if (self.status === PENDING) {
            self.status = REJECTED
            self.reason = reason
            self.onRejected.forEach(fn=> fn())
        }
    }
    try {
       executor(resolve,reject)
    }catch (e) {
        reject(e)
    }
}

Promise.prototype.then = function(onFulfilled,onRejected){
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled: value => value
    onRejected = typeof  onFulfilled === 'function' ? onRejected : reason => {throw reason}
    let self = this
    let promise2 = new Promise((resolve,reject) => {
        if (self.status === FULFILLED) {
            setTimeout(() => {
                try {
                   let x = onFulfilled(self.value)
                   resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            },0)
        } else if (self.status === REJECTED) {
            setTimeout(() => {
                try {
                    let x = onRejected(self.value)
                    resolvePromise(promise2,x,resolve,reject)
                }catch (e) {
                    reject(e)
                }
            },0)
        } else if (self.status === PENDING) {
            self.onFulfilled.push(() => {
                setTimeout(() => {
                    try {
                       let x = onFulfilled(self.value)
                       resolvePromise(promise2,x,resolve,reject)
                    }catch (e) {
                       reject(e)
                    }
                },0)
            })
            self.onFulfilled.push(() => {
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
    let self = this
    if (promise2 === x) {
        reject(new TypeError('Chaining cycle'))
    }
    if (x && typeof x === 'object' || typeof x === 'function') {
        let used
        try {
            let then = x.then
            if (typeof then === 'function') {
                  then.call(x, (y) => {
                     if (used) return
                     used = true
                     resolvePromise(promise2,y,resolve,reject)
                  }, (r) => {
                      if (used) return
                      used = true
                      reject(r)
                  })
            } else {
                if (used) return
                used = true;
                resolve(x)
            }
        } catch (e) {
            if (used) return
            used = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}
