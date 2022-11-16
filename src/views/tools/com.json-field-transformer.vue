<template>
    <div id="json-field-connector">
        <h3 id="title">json字段转换</h3>
        <div id="filter-area">
            <el-checkbox v-model="reverseSplit" label="逆向拆分"></el-checkbox>
            <el-checkbox v-model="compressOutput" label="压缩结果"></el-checkbox>
        </div>
        <div id="content-area">
            <div id="input">
                <el-input v-model.trim="inputValue" type="textarea" placeholder="输入要处理的对象"></el-input>
            </div>
            <div id="output">
                <pre><code ref="refCode" class="language-json"></code></pre>
            </div>
        </div>
    </div>
</template>

<script>
import "prismjs/plugins/toolbar/prism-toolbar.js"
import "prismjs/themes/prism-coy.min.css"

const prismJs = require("prismjs")

const isObject = (o) => Object.prototype.toString.call(o) === "[object Object]"
/**
 * 连接键，一级提升
 * @param {Object} jsonObj
 * @param {Object} ret
 * @param {String}  cacheStr
 * @return {{}}
 */
const connectField = (jsonObj, ret = {}, cacheStr = "") => {
    const tempCacheStr = cacheStr
    Object.entries(jsonObj).forEach(([k, v]) => {
        cacheStr = cacheStr ? cacheStr + "_" + k : k
        if (isObject(v)) connectField(v, ret, cacheStr)
        else ret[cacheStr] = v
        cacheStr = tempCacheStr
    })
    return ret
}

const deepConstruct = (kSplit = [], cacheObj = {}, setValue) => {
    if (kSplit.length) {
        const key = kSplit.pop()
        if (kSplit.length) {
            cacheObj[key] = cacheObj[key] || {}
            deepConstruct(kSplit, cacheObj[key], setValue)
        } else cacheObj[key] = setValue
    }
    return cacheObj
}
/**
 * 反向拆分
 * @param {Object} jsonObj
 */
const splitField = (jsonObj) => {
    let ret = {}
    Object.entries(jsonObj).forEach(([k, v]) => {
        const kSplit = k.split("_")
        deepConstruct(kSplit.reverse(), ret, v)
    })
    return ret
}

export default {
    name: "json-field-transformer",
    text: "JSON字段转换",
    icon: "json-field-transformer",
    data() {
        return {
            reverseSplit: false,
            compressOutput: false,
            inputValue: "",
        }
    },
    computed: {
        outputValue() {
            try {
                if (this.inputValue) {
                    let retValue = ""
                    if (this.reverseSplit) {
                        retValue = splitField(JSON.parse(this.inputValue))
                    } else {
                        retValue = connectField(JSON.parse(this.inputValue))
                    }
                    return JSON.stringify(retValue, null, this.compressOutput ? "" : "\t")
                } else return ""
            } catch (e) {
                return e.toString()
            }
        }
    },
    watch: {
        outputValue() {
            this.update()
        }
    },
    methods: {
        update() {
            this.$refs.refCode.innerHTML = this.outputValue
            this.$nextTick(() => prismJs.highlightAll())
        }
    },
    mounted() {
        this.update()
    }
}
</script>

<style lang="scss">
div#json-field-connector {
    width: 70%;
    height: 520px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    border: 1px solid #3af;
    border-radius: .5rem;
    overflow: hidden;

    > div#filter-area {
        width: 100%;
        padding: 1rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #aaa;
        border-top: 1px solid #aaa;

        .el-select {
            margin-left: 2rem;
        }
    }

    > div#content-area {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        > div {
            .el-textarea {
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

        > #input {
            flex-shrink: 0; // flex-shrink也会影响到overflow的，设为0时会导致高度不会限制，overflow不会有滚动条
            height: 168px;
        }

        #output {
            overflow: auto;
            flex-grow: 1;

            > pre {
                height: 100%;
                box-sizing: border-box;
                margin: 0;
            }

            &:hover > .icon-copy {
                display: inline-block;
            }
        }
    }

}
</style>