function greeter(person:string){
    return 'hello,' + person
}
let user = 'zhang'
document.body.innerHTML = greeter(user)

let num: any =1
num = '3'
let num1: string = '2'
console.log(typeof num1)

interface SquareConfig {
    color: string,
    width?: number
}
function createSquare(config: SquareConfig){
    config.color = undefined
    if (config.color) {
        console.log(config)
    }
}

let arr: string[] = ['1','2']
let arr1: Array<number> = [3,4]
let arr2: [string,boolean,number] = ['2',false,3]

function fn(): number{
    return 1
}

function fn1(): void{

}
function getLength(x: number | string){
    if ((<string>x).length) {
        return (x as string).length
    } else {
        return x.toString().length
    }
}

console.log(getLength(123))

interface Iobj {
    readonly id: number
    name: string
    age?: number
}
const obj: Iobj = {
    id: 1,
    name: 'zhang'
}
console.log(obj.id)

interface IWheel {
    wheelType: string
    roll(): string
}
interface Light {
    lightOn(): void,
    lightOff(): void
}
