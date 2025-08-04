<template>
    <div id="random-chars">
        <HeadRender with-bottom-border></HeadRender>
        <div id="content-area">
            <div id="input">
                <div>
                    <el-checkbox v-model="alphabetEnabled" label="字母长度"></el-checkbox>
                    <el-input v-model.number="alphabetLength" :min="1" placeholder="请输入"></el-input>
                </div>
                <div>
                    <el-checkbox v-model="numEnabled" label="数字长度"></el-checkbox>
                    <el-input v-model.number="numLength" :min="1" placeholder="请输入"></el-input>
                </div>
                <div>
                    <el-checkbox v-model="charEnabled" label="符号长度"></el-checkbox>
                    <el-input v-model.number="charLength" :min="1" placeholder="请输入"></el-input>
                </div>
                <div class="full">
                    <fieldset>
                        <legend>字符（todo：各项开关）</legend>
                        <div>
                            <el-select v-model="complexCharsInclude0" multiple>
                                <el-option v-for="c in complexChars[0]" :value="c"></el-option>
                            </el-select>
                            <el-select v-model="complexCharsInclude1" multiple class="half">
                                <el-option v-for="c in complexChars[1]" :value="c"></el-option>
                            </el-select>
                            <el-select v-model="complexCharsInclude2" multiple class="half">
                                <el-option v-for="c in complexChars[2]" :value="c"></el-option>
                            </el-select>
                            <el-select v-model="complexCharsInclude3" multiple class="half">
                                <el-option v-for="c in complexChars[3]" :value="c"></el-option>
                            </el-select>
                            <el-select v-model="numsInclude" multiple class="half">
                                <el-option v-for="c in numsInclude" :value="c"></el-option>
                            </el-select>
                            <el-select v-model="alphabetCharsLowerInclude" multiple>
                                <el-option v-for="c in alphabetCharsLower" :value="c"></el-option>
                            </el-select>
                            <el-select v-model="alphabetCharsUpperInclude" multiple>
                                <el-option v-for="c in alphabetCharsUpper" :value="c"></el-option>
                            </el-select>
                        </div>
                    </fieldset>
                </div>
                <div class="full">
                    <el-checkbox v-model="customizeEnabled" label="字符（自定义）"></el-checkbox>
                    <label for="chars-customized"></label>
                    <el-input id="chars-customized" v-model.number="charsCustomized"
                              placeholder="请输入"></el-input>
                </div>
                <div>
                    <el-button @click="updateCompute">刷新</el-button>
                </div>
            </div>
            <div id="output">
                {{ outputValue }}
            </div>
        </div>
        <FAQRender></FAQRender>
    </div>
</template>

<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"
import {computed, ref} from "vue";
import FAQRender from "@/components/faq-render.vue"

defineOptions({
    name: "random-chars",
    text: "随机字符串",
    icon: "string-converter",
    description: "生成随机字符串",
    devOnly: true,
    faqList: [
        {title: "未完待续"}
    ]
})

const complexChars = [
    // 数字区一排
    "~`!@#$%^&*()-=_+".split(""),
    "{}[]\\|".split(""),
    ";:'\"".split(""),
    "<>,./?".split(""),
]


const alphabetEnabled = ref(true)
const numEnabled = ref(true)
const charEnabled = ref(true)

const alphabetLength = ref(6)
const numLength = ref(2)
const charLength = ref(2)

const complexCharsInclude0 = ref([...complexChars[0]])
const complexCharsInclude1 = ref([...complexChars[1]])
const complexCharsInclude2 = ref([...complexChars[2]])
const complexCharsInclude3 = ref([...complexChars[3]])

const alphabetCharsLower = new Array("z".charCodeAt(0) - "a".charCodeAt(0) + 1).fill("").map((_, index) => {
    return String.fromCharCode(index + "a".charCodeAt(0))
})
const alphabetCharsUpper = new Array("Z".charCodeAt(0) - "A".charCodeAt(0) + 1).fill("").map((_, index) => {
    return String.fromCharCode(index + "A".charCodeAt(0))
})

const alphabetChars = [...alphabetCharsLower, ...alphabetCharsUpper]

const alphabetCharsLowerInclude = ref([...alphabetCharsLower])
const alphabetCharsUpperInclude = ref([...alphabetCharsUpper])

const customizeEnabled = ref(false)
const charsCustomized = ref("")
// 主要用来触发刷新的
const updateSeed = ref("")

const nums = new Array(57 - 48 + 1).fill("").map((_, index) => {
    return String.fromCharCode(48 + index)
})
const numsInclude = ref([...nums])

const getCharsToUse = (numCount: number, chartCount: number, alphabetCount: number) => {
    const _numLength = numEnabled.value ? numLength.value : 0
    const _charLength = charEnabled.value ? charLength.value : 0
    const _alphabetLength = alphabetEnabled.value ? alphabetLength.value : 0
    const charsets: string[] = []
    if (numCount < _numLength) charsets.push(...nums)
    // 混合字符
    if (chartCount < _charLength) charsets.push(
        ...[
            ...complexCharsInclude0.value,
            ...complexCharsInclude1.value,
            ...complexCharsInclude2.value,
            ...complexCharsInclude3.value,
            ...charsCustomized.value.split(""),
        ]
    )
    if (alphabetCount < _alphabetLength) charsets.push(...alphabetChars)
    return charsets
}

const outputValue = computed(() => {
    if (updateSeed.value) {
    }
    return computeOutput()
})

const computeOutput = () => {
    const _numLength = numEnabled.value ? numLength.value : 0
    const _charLength = charEnabled.value ? charLength.value : 0
    const _alphabetLength = alphabetEnabled.value ? alphabetLength.value : 0
    const l = _numLength + _charLength + _alphabetLength
    const values: string[] = []
    let numCount = 0, charCount = 0, alphabetCount = 0
    for (let i = 0; i < l; i++) {
        const charsets = getCharsToUse(numCount, charCount, alphabetCount)
        const c = generateRandomChar(charsets)
        if (alphabetChars.includes(c)) alphabetCount += 1
        else if (nums.includes(c)) numCount += 1
        else charCount += 1
        values.push(c)
    }
    return values.join("")
}

const generateRandomChar = (charIncludes: string[]) => {
    return charIncludes[Math.floor(Math.random() * charIncludes.length)]
}

const updateCompute = () => {
    updateSeed.value = Math.random().toString()
}
</script>

<style lang="scss" scoped>
#random-chars {
    fieldset {
        width: 100%;

        > div {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            > *.half {
                width: 48%;
            }

            > * {
                margin-bottom: 12px;
            }
        }
    }
}

#content-area {
    display: flex;
    flex-direction: column-reverse;
    box-sizing: border-box;

    > * {
        flex-shrink: 0;
        padding: 12px;

        &:last-child {
            flex-grow: 1;
        }
    }

}

#input {
    display: flex;
    flex-wrap: wrap;
    grid-gap: 1em;

    > div {
        display: flex;
        align-items: center;

        > label {
            white-space: nowrap;
            padding-right: 12px;
        }

        &.full {
            width: 100%;
        }

        &:last-child {
            flex-grow: 1;
            display: flex;
            justify-content: flex-end;
        }
    }
}

#output {
    border-bottom: 1px solid #999;
}
</style>
