import console from "@cynario/console.image"
const pkg = require("/package.json")

console.log("欢迎使用！")
console.image(require("@/assets/hi.png"))
console.log(`${location.origin} v${pkg.version}`)
