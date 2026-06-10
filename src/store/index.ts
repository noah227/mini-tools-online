import {defineStore} from "pinia";


export const supportedLanguages = [
    "zh-CN",
    "en-US"
]
export const defaultI18nLanguage = supportedLanguages[0]
export const useGlobalStateStore = defineStore("globalState", {
    state() {
        return {
            zenMode: false,
            userLang: "",
            seed: 0
        }
    },
    actions: {
        init() {
            this.initUserLang()
        },
        initUserLang() {
            const lang = navigator.language
            if (supportedLanguages.includes(lang)) this.userLang = lang
            else this.userLang = defaultI18nLanguage
        },
        updateSeed() {
            this.seed += 1
        },
        switchZenMode() {
            this.zenMode = !this.zenMode
        }
    }
})