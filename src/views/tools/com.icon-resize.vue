<template>
    <div id="icon-resize">
        <HeadRender with-bottom-border></HeadRender>
        <div id="content-area">
            <div id="input">
                <div id="img-container">
                    <div>
                        <img v-if="renderImg" :src="renderImg" :alt="renderImg" @click="selectImage">
                        <el-button v-else type="primary" size="small" plain @click="selectImage">添加图片</el-button>
                    </div>
                    <div id="img-info">
                        <b>Name: </b>
                        <span>{{ renderImgInfo.name }}</span>
                        <b>Size: </b>
                        <span>{{ renderImgInfo.size }}</span>
                        <b>Ext: </b>
                        <span>{{ renderImgInfo.ext }}</span>
                        <b>MIME: </b>
                        <span>{{ renderImgInfo.mime }}</span>
                    </div>
                </div>
                <div id="controls">
                    <fieldset>
                        <legend>自定义</legend>
                        <div>
                            <el-tooltip>
                                <el-form-item label="Name">
                                    <el-input v-model.trim="nameFormatPattern"
                                              placeholder="e.g, [name]-[size].[ext]"></el-input>
                                </el-form-item>
                                <template #content>
                                    <div>
                                        <div>Name format pattern (Optional)</div>
                                        <ListRender :data-list="namePatterHelpMessage"></ListRender>
                                    </div>
                                </template>
                            </el-tooltip>
                        </div>
                    </fieldset>
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
import ListRender, {TListData} from "@/components/list-render.vue";
import {computed, ref} from "vue";
import JSZip from "jszip";
import {saveAs} from "file-saver"
import {fileTypeFromStream} from "file-type";

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
            title: "选择图片后会自动勾选不大于该图片尺寸的选项"
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
    name: "",
    width: 0,
    height: 0,
    ext: "",
    mime: ""
})

const renderImgInfo = computed(() => {
    const {name, width, height, ext, mime} = srcImgInfo.value
    return {
        name: name || "-",
        size: width && height ? [width, height].join(" x ") : "-",
        ext: ext || "-",
        mime: mime || "-"
    }
})

const renderImg = computed(() => {
    return srcImg.value
})

const selectImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".ico"
    input.multiple = false
    input.onchange = () => {
        if (input.files?.length) {
            const file = input.files[0]
            srcImgFile.value = file
            srcImg.value = window.URL.createObjectURL(new Blob([file]))
            const img = new Image()
            img.src = srcImg.value
            img.onload = async () => {
                srcImgInfo.value = {
                    ...srcImgInfo.value,
                    name: file.name,
                    width: img.naturalWidth,
                    height: img.naturalHeight
                }
                const w = img.naturalWidth
                commonlyUsedChecked.value = commonlyUsedSizes.filter(item => item.value <= w).map(({value}) => value)
                updateSizesAllChecked()

                const result = await fileTypeFromStream(file.stream())
                if (result) {
                    const {ext, mime} = result
                    srcImgInfo.value = {
                        ...srcImgInfo.value,
                        ext, mime
                    }
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

// todo: 同时支持ico和png的输入，且导出相应的格式
const nameFormatPattern = ref("")
const nameFormatFunction = computed(() => {
    return nameFormatPattern.value ? formatNamePatterned : formatNameDefault
})
const namePatterHelpMessage: TListData = [
    {
        text: "Format args",
        subDataList: [
            {
                text: "name: filename",
                subDataList: [{text: "Optional, name part without file extension"}]
            },
            {
                text: "size: selected icon size",
                subDataList: [{html: "<b>Required</b>, to make filename unique"}]
            },
            {
                text: "ext: file extension",
                subDataList: [{text: "Optional, default to input file's extension"}]
            }
        ]
    }
]
const formatNameDefault = (size: number) => {
    return `image-${size}.png`
}

const formatNamePatterned = (size: number) => {
    const {name, ext} = srcImgInfo.value
    return nameFormatPattern.value
        .replaceAll("[name]", name.replace(new RegExp(`.${ext}\$`), ""))
        .replaceAll("[size]", size.toString())
        .replaceAll("[ext]", ext)
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
            console.log(sizes)
            if (sizes.length === 1) {
                return convertImage(
                    canvas, ctx, imgBitMap,
                    sizes[0],
                    (filename) => {
                        canvas.toBlob((b) => {
                            b && saveAs(b, filename)
                        })
                    }
                )
            }
            sizes.forEach(size => {
                convertImage(
                    canvas, ctx, imgBitMap,
                    size,
                    (filename, dataUrl) => {
                        zip.file(filename, dataUrl, {base64: true})
                    }
                )
            })
            zip.generateAsync({type: "blob"}).then(b => {
                saveAs(b, `images.zip`)
            })
        }
    })
}

const convertImage = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    imgBitMap: ImageBitmap,
    size: number,
    callback: (filename: string, dataUrl: string) => void
) => {
    canvas.width = size
    canvas.height = size
    ctx.drawImage(imgBitMap, 0, 0, size, size)
    const filename = nameFormatFunction.value(size)
    // todo 浏览器原生应该是不支持ico类型转换的
    // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL
    // 但是，toBlob方法可以，但泛用性有待验证
    // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob
    const dataUrl = canvas.toDataURL("image/ico").replace("data:image/png;base64,", "")
    callback(filename, dataUrl)
}

const downloadSingle = () => {

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

    .larger-than-natural {
        color: #E6A23C;
    }

    .el-checkbox-group > label {
        height: 28px;
        line-height: 28px;
    }

    @media screen and (max-width: 960px) {
        div#content-area {
            flex-direction: column;

            > * {
                width: 100%;
                height: fit-content;
            }
        }
        #input {
            flex-direction: column;
            border-bottom: 1px solid #aaa;
            border-right: none;
        }

        #output {
            min-height: 200px;
        }
    }

}

#input {
    width: 520px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #aaa;
    overflow: auto;

    > * {
        width: 100%;
        flex-shrink: 0;
    }

    > div:first-child {
        box-sizing: border-box;
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


#img-container {
    display: flex;

    > div:first-child {
        width: 168px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 168px;
        border-right: 1px dashed #aaa;
        box-sizing: border-box;
        flex-shrink: 0;

        img {
            max-width: 128px;
        }
    }

    > div:last-child {
        flex-grow: 1;
    }
}

#img-info {
    display: grid;
    grid-template-columns: repeat(2, auto);
    color: #666;
    line-height: 1.8;
    padding: 12px;
    box-sizing: border-box;

    > b {
        display: inline-block;
        width: 48px;
        text-align: right;
        margin-right: 12px;
        color: #666;
    }

    > span {
        word-break: break-all;
    }
}

#controls {
    display: grid;
    grid-template-columns: repeat(2, auto);
    padding: 12px;
    box-sizing: border-box;
    border-top: 1px solid #aaa;

    > * {
        flex-grow: 1;
    }

    > fieldset:first-child {
        grid-column-start: 1;
        grid-column-end: 3;
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
