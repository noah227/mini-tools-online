<template>
    <div id="icon-resize">
        <HeadRender with-bottom-border></HeadRender>
        <div id="content-area">
            <div id="input">
                <div id="img-container">
                    <img v-if="renderImg" :src="renderImg" :alt="renderImg" @click="selectImage">
                    <el-button v-else type="primary" size="small" plain @click="selectImage">添加图片</el-button>
                </div>
                <div id="img-info">
                    {{ [srcImgInfo.width, srcImgInfo.height].join(" x ") }}
                </div>
                <div id="controls">
                    <fieldset>
                        <legend>常用尺寸</legend>
                        <div id="icon-sizes">
                            <el-checkbox v-model="sizesAllChecked" :value="true" label="全选" :disabled="!srcImg"
                                         @change="handleAllCheckedChange"></el-checkbox>
                            <el-checkbox-group v-model="commonlyUsedChecked" :disabled="!srcImg"
                                               @change="updateSizesAllChecked">
                                <el-checkbox v-for="item in commonlyUsedSizes" :key="item.value" :label="item.label"
                                             :value="item.value">
                                    <template #default>
                                        <span :class="srcImg && item.value > srcImgInfo.width && 'larger-than-natural'">{{
                                                item.label
                                            }}</span>
                                    </template>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>自定义</legend>
                    </fieldset>
                    <fieldset>
                        <legend>操作</legend>
                        <div id="ops">
                            <el-button type="primary" size="small" plain :disabled="!commonlyUsedChecked.length"
                                       @click="downloadSelected">下载已选择
                            </el-button>
                            <el-button type="primary" size="small" plain :disabled="!srcImg" @click="downloadAll">下载所有
                            </el-button>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div id="output">
                <div v-if="renderImg" class="img-item" v-for="size in renderImgSizes"
                     :class="imgSelected(size) && 'img-selected'">
                    <img :src="renderImg" :alt="renderImg" :width="size" @click="switchImgSelect(size)">
                    <span>{{ [size, size].join(" x ") }}</span>
                </div>
            </div>
        </div>
        <FAQRender></FAQRender>
    </div>
</template>
<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"
import FAQRender from "@/components/faq-render.vue"
import {computed, ref} from "vue";
import JSZip from "jszip";
import {saveAs} from "file-saver"

defineOptions({
    name: "icon-resize",
    text: "ICON尺寸转换",
    icon: "resize",
    description: "常用及自定义转换",
    faqList: [
        {
            title: "本模块旨在处理标准方形的icon图形文件"
        },
        {
            title: "选择图片后会自动勾选小于该图片尺寸的选项"
        },
        {
            title: "<span style='color: #E6A23C'>橙色</span>尺寸表示该尺寸已经大于原始输入图片了"
        }
    ]
})

const createSortMethod = (reverse = false) => {
    return (a: number, b: number) => (a - b > 0 ? 1 : -1) * (reverse ? -1 : 1)
}
const convertRender = (items: number[]) => {
    items.sort(createSortMethod())
    return items.map(_ => ({
        value: _,
        label: [_, _].join(" x ")
    }))
}

const commonlyUsedSizes = convertRender(
    [...(new Array(7).fill("").map((_, index) => {
        return Math.pow(2, index + 4)
    })), 48]
)

const sizesAllChecked = ref(false)
const commonlyUsedChecked = ref<number[]>([])

const renderImgSizes = computed(() => {
    return [...commonlyUsedChecked.value].sort(createSortMethod(true))
})

const updateSizesAllChecked = () => {
    sizesAllChecked.value = commonlyUsedChecked.value.length === commonlyUsedSizes.length
}

const handleAllCheckedChange = (allChecked: boolean) => {
    if (allChecked) commonlyUsedChecked.value = commonlyUsedSizes.map(item => item.value)
    else commonlyUsedChecked.value = []
}

const srcImgFile = ref<File>()
const srcImg = ref("")
const srcImgInfo = ref({
    width: 0,
    height: 0
})
const renderImg = computed(() => {
    return srcImg.value
})

const selectImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".ico"
    input.multiple = true
    input.onchange = () => {
        if (input.files) {
            for (let i = 0; i < input.files.length; i++) {
                srcImgFile.value = input.files[0]
                srcImg.value = window.URL.createObjectURL(new Blob([input.files[0]]))
                const img = new Image()
                img.src = srcImg.value
                img.onload = () => {
                    srcImgInfo.value.width = img.naturalWidth
                    srcImgInfo.value.height = img.naturalHeight
                    const w = img.naturalWidth
                    commonlyUsedChecked.value = commonlyUsedSizes.filter(item => item.value <= w).map(({value}) => value)
                    updateSizesAllChecked()
                }
            }
        }
    }
    input.click()
}

const imgSelected = (size: number) => {
    return commonlyUsedChecked.value.includes(size)
}
const switchImgSelect = (size: number) => {
    // 因为图片渲染列表已经过滤了未选择的了，所以这里再切换选择没有必要
    if (1 > 0) return
    const index = commonlyUsedChecked.value.indexOf(size)
    if (index < 0) commonlyUsedChecked.value.push(size)
    else commonlyUsedChecked.value.splice(index, 1)
}

const downloadSelected = () => {
    downloadWidthSizes(commonlyUsedChecked.value)
}

const downloadAll = () => {
    downloadWidthSizes(commonlyUsedSizes.map(({value}) => value))
}
const downloadWidthSizes = (sizes: number[]) => {
    // todo 批量下载会被浏览器拒绝的问题（打包处理）
    createImageBitmap(srcImgFile.value as ImageBitmapSource, {}).then(imgBitMap => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
        const img = new Image()
        img.src = srcImg.value
        img.onload = () => {
            const zip = new JSZip()
            sizes.forEach(size => {
                canvas.width = size
                canvas.height = size
                ctx.drawImage(imgBitMap, 0, 0, size, size)
                // todo 浏览器原生应该是不支持ico类型转换的
                // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL
                // 但是，toBlob方法可以，但泛用性有待验证
                // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob
                zip.file(
                    `image-${size}.png`,
                    canvas.toDataURL("image/ico").replace("data:image/png;base64,", ""),
                    {base64: true}
                )
            })
            zip.generateAsync({type: "blob"}).then(b => {
                saveAs(b, `images.zip`)
            })
        }
    })
}
</script>

<style lang="scss" scoped>
div#icon-resize {
    > div#content-area {
        flex-grow: 1;
        display: flex;

        > * {
            height: 100%;
            flex-shrink: 0;
        }
    }

    #img-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 168px;

        img {
            max-width: 128px;
        }
    }

    #img-info {
        display: flex;
        justify-content: center;
        color: #666;
        padding: 8px 0;
        border-top: 1px dashed #aaa;
        border-bottom: 1px dashed #aaa;
    }

    .larger-than-natural {
        color: #E6A23C;
    }

    .el-checkbox-group > label {
        height: 28px;
        line-height: 28px;
    }

    @media screen and (max-width: 520px) {
        div#content-area {
            flex-direction: column;

            > * {
                width: 100%;
                height: fit-content;
            }
        }
        #input {
            flex-direction: row;
            border-bottom: 1px solid #aaa;
            border-right: none;
        }
    }

}

#input {
    width: 298px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #aaa;
    overflow: auto;

    > div:first-child {

    }

    > div:last-child {
        flex-grow: 1;
    }

    #ops {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
}

#icon-sizes > .el-checkbox-group {
    display: grid;
    grid-template-columns: repeat(2, auto);
}

#output {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    // 为了换行
    width: 0;
    overflow: auto;

    > .img-item {
        width: fit-content;
        height: fit-content;
        flex-grow: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        box-sizing: border-box;
        margin: 4px;
        padding: 4px;
        border: 1px solid #0000;
    }
}
</style>
