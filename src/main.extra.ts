import console from "@cynario/console.image"
const pkg = require("/package.json")

console.image(require("@/assets/hi.png")).then(() => {
    console.log(`${location.origin} v${pkg.version}`)
})
