function Promise(exector) {
    let self = this;
    // 定义三种状态
    self.status = 'pending'
    self.value = undefined
    self.reason = undefined
    self.onResolveCallbacks = []
    self.onRejectedCallbacks = []
    function resolve(value) {
        // 状态为pending时才会执行
        if (self.status === 'pending') {
            self.value = value
            // 将状态改成成功的状态
            self.status = 'fulfilled'
            self.onResolveCallbacks.forEach((fn) => {
                fn(self.value)
            })
        }
    }
    function reject(reason) {
        if (self.status === 'pending') {
            self.reason = reason
            self.status = 'rejected'
            self.onRejectedCallbacks.forEach((fn) => {
                fn(self.reason)
            })
        }
    }
    try {
        exector(resolve,reject)
    }catch (e) {
        reject(e)
    }

}
//  如果resolve或者reject处于setTimeout(() => {},300)即处于异步之中
// 当我们new promise时不会马上执行异步代码，而是直接执行了promise.then方法
//  此时因为status依然是pending状态  所以不会执行resolve或者reject
// 当同步代码执行完，执行异步代码时，更新了status状态，但是then已经执行过了

// 解决方法  我们在new promise的时候声明两个数组，在then的时候将成功和失败存到各自的数组
// 一旦reslove或reject，就调用他们
Promise.prototype.then = function (onFulfilled,onRejected) {
    let self = this
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}
    let promise2 = new Promise((resolve,reject) => {
        if (self.status === 'pending') {
            self.onResolveCallbacks.push(() => {
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
        if (self.status === 'fulfilled') {
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
    })
    return promise2
}
/* // 如果x ==== promise2  则会造成循环引用，自己等待自己，则报“循环引用”错误
  let p = new Promise(resolve => {
      resolve(0)
  })
  let p2 = p.then(data => {
      // 循环引用，自己等待自己完成，一辈子也完不成
      return p2
  })*/
function resolvePromise(promise2,x,resolve,reject) {
    //防止多次调用
    let called
    if (promise2 === x) {
        return reject(new TypeError('循环引用错误'))
    }
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then
            // 如果then是函数，默认就是promise
            if (typeof then === 'function') {
                then.call(x,(y) => {
                    // 成功或者失败只能调用一次
                    if (called) return
                    called = true
                    // resolve的结果依旧是promise  那就继续解析
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
    }else {
        // x 是普通值  直接resolve
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
Promise.reject =  function (val) {
    return new Promise((resolve,reject) => {
        reject(val)
    })
}
// catch方法
Promise.prototype.catch = function(val){
    return this.then(null,val)
}

// race方法
Promise.race = function(promises) {
    return new Promise((resolve,reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(resolve,reject)
        }
    })
}

// all方法
/*Promise.all = function(promises) {
    let arr = []
    let i = 0
    function processData(index,data){
       arr[index] = data
       i++
       if (i == promises.length) {
           resolve(arr)
       }
    }
    return new Promise((resolve,reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(data => {
                processData(i,data)
            },reject)
        }
    })
}*/

Promise.all = function(promises){ // promises 是一个数组
    return new Promise((resolve,reject)=>{
        let arr = []
        let i = 0
        function processData(index,data){
            arr[index] = data
            // 5.我们能用arr.length === promises.length来判断请求是否全部完成吗？
            // 答案是不行的，假设arr[2] = 'hello swr'
            // 那么打印这个arr，将是[empty × 2, "hello swr"]，
            // 此时数组长度也是为3，而数组arr[0] arr[1]则为空
            // 那么换成以下的办法
            if(++i === promises.length){ // 6.利用i自增来判断是否都成功执行
                resolve(arr) // 此时arr 为['hello','swr']
            }
        }

        for(let i = 0;i < promises.length;i++){ // 1.在此处遍历执行
            promises[i].then((data)=>{ // 2.data是成功后返回的结果
                processData(i,data) // 4.因为Promise.all最终返回的是一个数组成员按照顺序排序的数组
                                    // 而且异步执行，返回并不一定按照顺序
                                    // 所以需要传当前的i
            },reject) // 3.如果其中有一个失败的话，则调用reject
        }
    })
}



