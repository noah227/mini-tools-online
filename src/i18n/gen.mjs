import fs from "node:fs"

const gen = () => {
    const _imports = []
    const _exports = []
    fs.readdirSync("./_locales", {withFileTypes: true}).forEach(d => {
        if (d.isFile()) {
            const n = d.name.replace(/\.ts$/, "")
            _imports.push(`import ${n} from "@/i18n/_locales/${n}"`)
            _exports.push(`"${n.replace("_", "-")}": ${n}`)
        }
    })
    const content = [
        `// Auto generated@${(new Date().toLocaleString())}`,
        `import {TI18nData} from "@/i18n/_shared.types";`,
        _imports.join("\n"), "\n",
        `export default {\n\t${_exports.join(",\n\t")}\n} as Record<string, TI18nData>`
    ].join("\n")
    fs.writeFileSync("./i18n.auto-messages-entry.ts", content, {encoding: "utf8"})
}

gen()