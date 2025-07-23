<template>
    <div id="map-utils">
        <HeadRender with-bottom-border></HeadRender>
        <div id="content-area">
            <div id="top-area">
                <el-radio-group v-model="activeName">
                    <el-radio-button v-for="item in modules" :value="item.value">
                        {{ item.label }}
                    </el-radio-button>
                </el-radio-group>
                <div>
                    <div>
                        <label for="map-key">key</label>
                        <el-input id="map-key" v-model="apiKey" style="width: 256px;"
                                  placeholder="在此处输入地图key"></el-input>
                        <el-button @click="handleMapInit">初始化地图</el-button>
                        <el-tooltip content="key仅存储在前端">
                            <el-checkbox v-model="cacheApiKey" label="缓存key"></el-checkbox>
                        </el-tooltip>
                        <el-button @click="clearCachedKey">清除key</el-button>
                    </div>
                    <div>
                        <el-button @click="locateTo">定位到</el-button>
                        <el-tooltip content="经度">
                            <el-input v-model="mapCenter[0]"></el-input>
                        </el-tooltip>
                        <el-tooltip content="纬度">
                            <el-input v-model="mapCenter[1]"></el-input>
                        </el-tooltip>
                        <el-tooltip content="从剪贴板读取，逗号，空格均可有效识别">
                            <el-button @click="setFromClipBoard">粘贴</el-button>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <div id="map-area">
                <div id="map-container"></div>
                <div id="output">
                    <JsonHighlight :code="output" enable-copy></JsonHighlight>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"
import {computed, ref, shallowRef} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader"
import {ElMessage} from "element-plus";
import {CookieGet, CookieSet, syncRef} from "@/utils";
import JsonHighlight from "@/components/json-highlight.vue"

defineOptions({
    name: "map-utils",
    text: "地图工具",
    icon: "client",
    description: "基于高德地图的地图工具",
    devOnly: true
})

const modules = [
    {value: "PointSelector", label: "取点"},
    {value: "ContinuousPointSelector", label: "连续取点"},
    {value: "T3", label: "占位"},
]

const activeName = ref(modules[0].value)

const apiKey = ref()
const cacheApiKey = ref(false)
const syncKey = "com.api-key"
const clearCachedKey = () => {
    const key = CookieGet(syncKey)
    if (!key) ElMessage.info("当前没有存储的key")
    else {
        CookieSet(syncKey, "")
        ElMessage.success("已清除存储的key")
    }
}
const mapInst = shallowRef<AMap.Map>()
const mapCenter = ref<[number, number]>([0, 0])
const mapClickInfo = ref({
    lng: 0,
    lat: 0
})
const mapClickRecord = ref<[number, number][]>([])
const setFromClipBoard = () => {
    navigator.clipboard.readText().then(text => {
        if (!mapInst.value) return
        const ret = text.trim().replaceAll(/\s+/g, " ").split(/[\s,]/)
        if (ret.length === 2) {
            const [_lng, _lat] = ret
            const lng = parseFloat(_lng)
            const lat = parseFloat(_lat)
            if (!isNaN(lng) && !isNaN(lat)) {
                mapCenter.value = [lng, lat]
                mapInst.value.setCenter(mapCenter.value)
                console.log(mapInst.value.setCenter)
            } else console.warn("读取数据格式错误，已跳过")
        } else {
            console.log(ret)
            ElMessage.warning("未读取到符合格式的内容")
        }
    }).catch(e => {
        ElMessage.error("读取剪贴板失败，请检查权限")
        console.error(e)
    })
}

const output = computed(() => {
    let ret: Object = {}

    switch (activeName.value) {
        case "PointSelector":
            ret = mapClickInfo.value
            break
        case "ContinuousPointSelector":
            ret = mapClickRecord.value
            break
    }
    return JSON.stringify(ret, null, 4)
})
const mapContext = {
    init() {
        if (!apiKey.value) return ElMessage.warning("请先配置地图的key")
        AMapLoader.load({
            key: apiKey.value,
            version: "2.0",
            plugins: [],
            Loca: {
                version: "2.0.0"
            }
        }).then((AMap: typeof window.AMap) => {
            mapInst.value = new AMap.Map("map-container")
            ElMessage.success("地图初始化成功")
            this.initEvents()
            this.initLocatePlugin(AMap)
        }).catch(e => {
            console.error(e)
            ElMessage.error("AMapLoader初始化失败，具体查看控制台错误信息")
        })
    },
    initEvents() {
        if (!mapInst.value) return
        mapInst.value.on("click", (e: any) => {
            const {lng, lat} = e.lnglat as { lng: number, lat: number }
            mapClickInfo.value = {lng, lat}
            if (activeName.value === "ContinuousPointSelector") {
                mapClickRecord.value.push([lng, lat])
            } else {
                mapClickRecord.value = []
            }
        })
    },
    initLocatePlugin(AMap: any) {
        AMap.plugin('AMap.Geolocation', function () {
            const geolocation = new AMap.Geolocation({
                // 是否使用高精度定位，默认：true
                enableHighAccuracy: true,
                // 设置定位超时时间，默认：无穷大
                timeout: 10000,
                // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                buttonOffset: new AMap.Pixel(10, 20),
                //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                zoomToAccuracy: true,
                //  定位按钮的排放位置,  RB表示右下
                buttonPosition: 'RB'
            })
            if (!mapInst.value) return
            mapInst.value.addControl(geolocation)
            AMap.Event.addListener(geolocation, 'complete', onComplete)
            AMap.Event.addListener(geolocation, 'error', onError)

            function onComplete(data: any) {
                // data是具体的定位信息
                console.log("已定位", data)
            }

            function onError(error: any) {
                ElMessage.error(`定位失败: ${error.message}`)
                console.error(error)
            }
        })
    }
}

syncRef(cacheApiKey, "com.cache-api-key")
if (cacheApiKey.value) syncRef(apiKey, syncKey)
if (apiKey.value) mapContext.init()

const handleMapInit = () => {
    mapContext.init()
}

const locateTo = () => {

}
</script>

<style lang="scss">
div#map-utils {

}

#content-area {
    flex-grow: 1;
    overflow: auto;
    height: 0;
    display: flex;
    flex-direction: column;
}

#top-area {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px;
    box-sizing: border-box;
    border-bottom: 1px solid #999;

    > * {
        display: flex;
        align-items: center;
    }

    > div:last-child {
        grid-gap: 1em;
        flex-direction: column;
        align-items: flex-end;

        > div {
            display: flex;
            align-items: center;
            grid-column-gap: 12px;
        }
    }
}

#map-area {
    height: 0;
    flex-grow: 1;
    display: flex;


    > * {
        height: 100%;
        flex-shrink: 0;
    }
}

#map-container {
    flex-grow: 1;
}

#output {
    box-sizing: border-box;
    border-left: 1px solid #999;
    width: 15em;
    overflow: auto;
}
</style>
