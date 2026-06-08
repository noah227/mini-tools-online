<template>
    <div id="exif-reader">
        <HeadRender></HeadRender>
        <div id="content-area">
            <div id="input-area">
                <div id="controls">
                    <span></span>
                    <span>
                        <el-button type="primary" size="small" plain @click="selectImage">添加图片</el-button>
                        <el-button type="primary" size="small" plain @click="clearInput">清空列表</el-button>
                    </span>
                </div>
                <div id="img-container">
                    <div class="img-item" :class="currentItem.url=== item.blobUrl ? 'is-current' : ''" v-for="(item, index) in renderFileList" :key="index" @click="readEXIF(item)">
                        <img :src="item.blobUrl" :alt="item.file.name">
                        <span class="image-name">{{ item.file.name }}</span>
                        <span class="img-type">{{ item.file.type }}</span>
                        <span title="移除" @click.stop="removeItem(item, index)">❌</span>
                    </div>
                </div>
            </div>
            <div id="render-area">
                <div v-if="false" id="img-wrapper">
                    <img v-if="currentItem.url" ref="refCurrentImg" :src="currentItem.url" alt="当前图片">
                </div>
                <div id="tags-wrapper" v-show="currentItem.tags.length">
                    <span class="tag-item" v-for="tag in currentItem.tags" :key="tag"
                          :class="currentItem.currentTag === tag && 'active'"
                          @click="handleTagClick(tag)">{{ tag }}</span>
                </div>
                <div id="detail-operations" v-if="currentItem.url || true">
                    <div>
                        <span :title="currentItem.name">{{ currentItem.name }}</span>
                    </div>
                    <div>
                        <el-button :disabled="!renderExifDetail" size="small" @click="viewWithFullscreen">全屏</el-button>
                        <el-button :disabled="!renderExifDetail" size="small" @click="copyDetail">复制</el-button>
                        <el-button :disabled="!renderExifDetail" size="small" @click="exportDetail">导出</el-button>
                    </div>
                </div>
                <div id="img-exif-details" ref="refDetailView">
<!--                    <pre ref="refDetailView">{{ renderExifDetail }}</pre>-->
                    <JsonHighlight :code="renderExifDetail"></JsonHighlight>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"
import JsonHighlight from "@/components/json-highlight.vue"
import {computed, nextTick, ref, watch} from "vue";

defineOptions({
    name: "exif-reader",
    text: "EXIF读取",
    icon: "exif-reader",
    description: "简单的图片EXIF读取"
})

const readFileList = ref<File[]>([])

type TRenderItem = {
    file: File,
    blobUrl: string
}
const renderFileList = computed<TRenderItem[]>(() => {
    return readFileList.value.map(img => {
        return {
            file: img,
            blobUrl: window.URL.createObjectURL(new Blob([img]))
        }
    })
})

watch(() => renderFileList.value.length, (l) => {
    l && nextTick(() => {
        readEXIF(renderFileList.value[l - 1])
    })
})

const removeItem = (item: TRenderItem, index: number) => {
    if (currentItem.value.name === item.file.name) resetCurrent()
    readFileList.value.splice(index, 1)
}

const selectImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".jpg,.tiff"
    input.multiple = true
    input.onchange = () => {
        if (input.files) {
            for (let i = 0; i < input.files.length; i++) {
                readFileList.value.push(input.files[i])
            }
        }
    }
    input.click()
}

const clearInput = () => {
    readFileList.value = []
    resetCurrent()
}

const refCurrentImg = ref()
const currentItem = ref({
    name: "",
    url: "",
    tags: <string[]>[],
    exifInfo: <{ [index: string]: any }>{},
    currentTag: ""
})

const resetCurrent = () => {
    currentItem.value = {
        name: "",
        url: "",
        tags: [],
        exifInfo: {},
        currentTag: ""
    }
}

const handleTagClick = (tag: string) => {
    currentItem.value.currentTag = currentItem.value.currentTag === tag ? "" : tag
}

const refDetailView = ref()

const viewWithFullscreen = () => {
    refDetailView.value.requestFullscreen()
}

const copyDetail = () => {
    navigator.clipboard.writeText(renderExifDetail.value).then(() => {
        ElMessage.success("已复制到剪贴板")
    }).catch(e => {
        console.error(e)
        ElMessage.error(`复制失败，请重试手动选择复制！【${e.message}】`)
    })
}

const exportDetail = () => {
    const a = document.createElement("a")
    a.href = window.URL.createObjectURL(new Blob([renderExifDetail.value]))
    a.type = "download"
    a.download = "xxx.json"
    a.click()
}

const renderExifDetail = computed(() => {
    const {url, exifInfo, currentTag} = currentItem.value
    if (!url || !exifInfo) return ""
    const _ = exifInfo[currentTag]
    return JSON.stringify(_ ? _ : exifInfo, null, 4)
})

import ExifReader from "exifreader"
import {ElMessage} from "element-plus";

const exifDataMap = ref<{ [index: string]: object }>({})
const readEXIF = (item: TRenderItem) => {
    const {file: img} = item
    if (currentItem.value.name === img.name) return
    if (exifDataMap.value[img.name]) setCurrent(item, exifDataMap.value[img.name])
    ExifReader.load(img).then(res => {
        setCurrent(item, res)
    })
}
const setCurrent = ({file: img, blobUrl}: TRenderItem, exifData: object) => {
    currentItem.value = {
        ...currentItem.value,
        name: img.name,
        url: blobUrl,
        exifInfo: exifData,
        tags: Object.keys(exifData)
    }
}
</script>

<style lang="scss" scoped>
#exif-reader {
    display: flex;
    flex-direction: column;

    > div:first-child {
        flex-shrink: 0;
    }

    > div:nth-child(2) {
        flex-grow: 1;

    }
}

#content-area {
    height: 0;
    border-top: 1px solid #999;
    overflow: hidden;
    display: flex;

    > div {
        width: 50%;
        box-sizing: border-box;

        &:first-child {
            border-right: 1px solid #999;
            display: flex;
            flex-direction: column;

        }
    }
}

@media screen and (max-width: 720px) {
    #content-area {
        flex-direction: column;
        > div {
            width: 100%;
        }
    }
}

#controls {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 38px;
    padding: 0 12px;
    border-bottom: 1px solid #999;
    box-sizing: border-box;
}

#img-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;

    > .img-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 12px;
        box-sizing: border-box;
        border-bottom: 1px solid #0000;
        transition: background-color ease-out .18s;

        > img {
            width: 128px;
            height: 72px;
            object-fit: cover;
            flex-shrink: 0;
            background-color: #f0f0f0;
        }

        > .image-name {
            padding: 0 8px;
        }

        &:not(:last-child) {
            border-bottom-color: #999;
        }

        &.is-current, &:hover {
            background-color: #ecf5ff;
        }

        > span:last-child {
            cursor: pointer;
            padding: 3px;
            border-radius: 3px;
        }
    }
}

#render-area {
    display: flex;
    flex-direction: column;
    overflow: auto;
}

#img-wrapper {
    display: flex;
    align-items: center;
    height: 128px;
    padding: 3px 12px;
    box-sizing: border-box;
    border-bottom: 1px solid #999;

    > img {
        height: 100%;
        object-fit: contain;
    }
}

#tags-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, 33%);
    border-bottom: 1px solid #999;
    max-height: 128px;
    overflow: auto;
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 3px;
    justify-content: center;
    align-items: center;

    > .tag-item {
        width: 100%;
        box-sizing: border-box;
        padding: 3px 0;
        background-color: #fafafa;
        user-select: none;
        transition: all linear .08s;
        border-bottom: 1px solid #f0f0f0;
        border-right: 1px solid #f0f0f0;
        font-size: 14px;

        &:hover {
            background-color: lightskyblue;
        }

        &.active {
            background-color: lightskyblue;
        }
    }
}

#detail-operations {
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    box-sizing: border-box;
    background-color: #ecf5ff;
    flex-shrink: 0;
    border-bottom: 1px solid #999;
    > div:first-child {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    > div:last-child {
        flex-shrink: 0;
    }
}

#img-exif-details {
    text-align: left;
    font-size: 14px;
    box-sizing: border-box;
    overflow: hidden;
    flex-grow: 1;
}
</style>
