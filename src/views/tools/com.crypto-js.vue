<template>
    <div id="crypto-js">
        <HeadRender></HeadRender>
        <FilterRender flex-wrap="wrap">
            <div id="base-controls">
                <label for="crypto-method">Method</label>
                <el-select v-model="method" id="crypto-method">
                    <el-option v-for="m in renderMethods" :value="m"></el-option>
                </el-select>
                <label for="crypto-encoding">ENC</label>
                <el-select v-model="encoding" id="crypto-encoding">
                    <el-option v-for="enc in cryptoEncodings" :value="enc"></el-option>
                </el-select>
                <el-select v-model="actionMode">
                    <el-option v-for="item in actionModes" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </div>
            <el-divider></el-divider>
            <fieldset>
                <legend>CipherOption</legend>
                <div>
                    <div>
                        <label for="crypto-mode">Mode</label>
                        <el-select v-model="cipherOption.mode" id="crypto-mode">
                            <el-option v-for="mode in cryptoModes" :value="mode"></el-option>
                        </el-select>
                    </div>
                    <div>
                        <label for="crypto-iv">iv</label>
                        <el-input v-model="cipherOption.iv" id="crypto-iv" placeholder="16/24/32 Bytes"></el-input>
                    </div>
                    <div>
                        <label for="crypto-pad">Padding</label>
                        <el-select v-model="cipherOption.padding" id="crypto-pad">
                            <el-option v-for="p in cryptoPaddings" :value="p"></el-option>
                        </el-select>
                    </div>
                    <div>
                        <label for="crypto-pad">Phrase</label>
                        <el-input v-model="cipherOption.phrase" id="crypto-phrase"
                                  placeholder="Security Phrase(128/192/256 Bits)"></el-input>
                    </div>
                </div>
            </fieldset>
        </FilterRender>
        <div id="content-area">
            <div id="input">
                <el-input ref="refInput" v-model.trim="decrypted" type="textarea" placeholder="明文"
                          :readonly="actionMode=== 'decrypt'"></el-input>
            </div>
            <div id="output">
                <el-input ref="refOutput" v-model="encrypted" type="textarea" placeholder="密文"
                          :readonly="actionMode === 'encrypt'"></el-input>
            </div>
        </div>
        <FAQRender></FAQRender>
    </div>
</template>
<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"
import FAQRender from "@/components/faq-render.vue"
import FilterRender from "@/components/filter-render.vue"
import CryptoJS from "crypto-js/index";
import {computed, ref, watch} from "vue";

defineOptions({
    name: "crypto-js",
    text: "Crypto-JS",
    icon: "crypto-js",
    description: "CryptoJS常用功能",
    devOnly: true,
    faqList: [
        {
            title: "Based on crypto-js@npm",
            link: "https://www.npmjs.com/package/crypto-js"
        },
        {
            title: "CryptoJS Docs",
            link: "https://cryptojs.gitbook.io/docs"
        }
    ]
})

const ENCRYPT_ONLY_METHODS = ["MD5", "SHA1", "SHA256"]
const SUPPORTED_METHODS = ["AES", "MD5", ...ENCRYPT_ONLY_METHODS]
const isEncryptOnlyMethod = (methodName: string) => {
    if (methodName.indexOf("SHA") >= 0) return true
    return ENCRYPT_ONLY_METHODS.includes(methodName)
}

const methods = Object.keys(CryptoJS)
console.log(methods)
const renderMethods = methods.filter(m => SUPPORTED_METHODS.includes(m))
const cryptoModes = Object.keys(CryptoJS.mode)
const cryptoPaddings = Object.keys(CryptoJS.pad)
const cryptoEncodings = Object.keys(CryptoJS.enc)

type TActionMode = "encrypt" | "decrypt"
const actionMode = ref<TActionMode>("encrypt")

// assert length
// option之类的之所以全绑定字符串值而不绑定对象，是为了syncRef
const method = ref(renderMethods[0])
const encoding = ref(cryptoEncodings[2])

// 用户AES等
const cipherOption = ref({
    mode: cryptoModes[0],
    iv: "This_is_an_iv!!!",
    padding: cryptoPaddings[0],
    phrase: "1234567812345678"
})

console.log(cipherOption.value)

const actionModes = computed(() => {
    const modesRaw: { label: string, value: TActionMode }[] = [
        {label: "加密", value: "encrypt"},
        {label: "解密", value: "decrypt"},
    ]
    if (isEncryptOnlyMethod(method.value)) {
        modesRaw.splice(1, 1)
        actionMode.value = modesRaw[0].value
    }
    return modesRaw
})

// 明文
const decrypted = ref("")
// 密文
const encrypted = ref("")

watch(() => decrypted.value, () => {
    if (actionMode.value === "encrypt") doEncrypt()
})

watch(() => encrypted.value, () => {
    if (actionMode.value === "decrypt") doDecrypt()
})

watch(() => ({
    actionMode: actionMode.value,
    method: method.value,
    encoding: encoding.value,
    v: cipherOption.value
}), () => {
    actionCrypto()
}, {deep: true})

const actionCrypto = () => {
    if (actionMode.value === "encrypt") doEncrypt()
    else doDecrypt()
}

const doEncrypt = () => {
    console.log("加密")
    const v = decrypted.value
    if (!v) return ""
    let ret: any
    const config = createConfig()
    switch (method.value) {
        case "AES":
            const key = createKey(cipherOption.value.phrase)
            ret = CryptoJS.AES.encrypt(parser.value.parse(v), key, config)
            break
        case "MD5":
            ret = CryptoJS.MD5(v, config)
            break
        case "SHA256":
            ret = CryptoJS.SHA256(v, config)
            break
    }
    if (typeof ret !== "undefined") encrypted.value = ret
}

const doDecrypt = () => {
    console.log("解密")
    const v = encrypted.value
    if (!v) return ""
    let ret: any

    const config = createConfig()
    switch (method.value) {
        case "AES":
            const key = createKey(cipherOption.value.phrase)
            ret = CryptoJS.AES.decrypt(v, key, config).toString(parser.value)
            break
        case "MD5":
            break
    }
    if (typeof ret !== "undefined") decrypted.value = ret
}

const parser = computed(() => {
    return (CryptoJS.enc as any)[encoding.value]
})

const createKey = (s: string) => parser.value.parse(s)

const createConfig = () => {
    const {mode, iv, padding} = cipherOption.value
    return {
        mode: (CryptoJS.mode as any)[mode],
        iv: parser.value.parse(iv),
        padding: (CryptoJS.pad as any)[padding]
    }
}

const refInput = ref()
const refOutput = ref()
watch(() => actionMode.value, mode => {
    if (mode === "encrypt") refInput.value.focus()
    else refOutput.value.focus()
})

</script>

<style lang="scss" scoped>
div#crypto-js {

}

:deep(.filter-render) {
    > * {
        width: 100%;
    }
}

#base-controls {
    display: flex;
    align-items: center;
    margin-right: 0 !important;

    > *:not(:last-child) {
        margin-right: 12px;
    }
}

fieldset {
    border-radius: 5px;
    border: 1px solid inherit;
    padding: 12px;

    > legend {
        padding: 0 12px
    }

    > div {
        display: grid;
        grid-template-columns: repeat(2, auto);
        grid-gap: 1em;


        > div {
            display: flex;
            align-items: center;

            > label {
                width: 6em;
                margin-right: 12px;
                text-align: right;
            }
        }
    }
}

div#content-area {
    flex-grow: 1;
    display: flex;
    height: 100%;

    > div {
        flex-grow: 1;

        :deep(.el-textarea) {
            width: 100%;
            height: 100%;

            textarea {
                width: 100%;
                height: 100%;
                font-size: 1.2rem;
                line-height: 1.2;
            }
        }
    }
}

@media screen and (max-width: 520px) {
    div#content-area {
        flex-direction: column
    }
}
</style>
