let name = 'zhang'
export function haha() {
    console.log('====',name)
}
export function zh(){
    console.log(6666)
}
let student = {
    age: 18,
    say() {
        console.log('hello world')
    }
}
export default function (){
    console.log('我是默认函数')
}
export {name}
export {student}