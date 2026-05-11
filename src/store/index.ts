import {defineStore} from "pinia";


export const useGlobalStateStore = defineStore("globalState", {
    state(){
        return {
            zenMode: false
        }
    },
    actions: {
        switchZenMode(){
            this.zenMode = !this.zenMode
        }
    }
})