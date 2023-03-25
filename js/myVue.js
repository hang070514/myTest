function compile(node,vm){
    var reg = /\{\{(.*)\}\}/
    if (node.nodeType === 1) {
        var attr = node.attributes
        for(let i =0; i < attr.length; i++){
            if (attr[i].nodeName == 'v-model') {
                var name = attr[i].nodeValue
                node.addEventListener('input', function(e) {
                  vm[name] = e.target.value
                })
                node.value = vm[name]
                node.removeAttribute('v-model')
            }
        }
    }
    if (node.nodeType === 3) {
        if (reg.test(node.nodeValue)) {
            var name = RegExp.$1
            name = name.trim()
            // node.nodeValue = vm[name]
            new Watcher(vm, node, name)
        }
    }
}

function nodeToFragment(node,vm){
    var fragment = document.createDocumentFragment()
    var child
    while(child = node.firstChild) {
        compile(child,vm)
        fragment.appendChild(child)
    }
    return fragment
}

function Vue(options){
    this.data = options.data
    var data = this.data
    observe(data, this)
    var id = options.el
    var dom = nodeToFragment(document.getElementById(id), this)
    document.getElementById(id).appendChild(dom)
}

function defineReactive(obj, key, val) {
    var dep = new Dep()
    Object.defineProperty(obj, key, {
        get: function () {
            if (Dep.target) {
               dep.addSub(Dep.target)
            }
            return val
        },
        set: function(newVal) {
            if (newVal === val) {
               return
            }
            val = newVal
            console.log('新值:', val)
            dep.notify()
        }
    })
}

function observe(obj, vm) {
   for(let key of Object.keys(obj)) {
       defineReactive(vm, key, obj[key])
   }
}

function Watcher(vm, node, name) {
    Dep.target = this
    this.vm = vm
    this.node = node
    this.name = name
    this.update()
    Dep.target = null
}

Watcher.prototype = {
    update() {
        this.get()
        this.node.nodeValue = this.value
    },
    get() {
        this.value = this.vm[this.name]
    }
}

function Dep() {
    this.subs = []
}
Dep.prototype = {
    addSub(sub) {
       this.subs.push(sub)
    },
    notify() {
        this.subs.forEach(function (sub){
            sub.update()
        })
    }
}
