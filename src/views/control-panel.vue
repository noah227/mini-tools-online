<template>
    <div id="control-panel">
        <h3 id="title">迷你小工具</h3>
        <div v-if="!showContent" id="item-list">
            <router-link v-for="{name, text, icon} in tools" class="tool-item" :key="name" :to="{name}">
                <com-svg-loader class="svg-icon" :name="icon"/>
                <span class="text">{{ text || name }}</span>
            </router-link>
        </div>
        <div v-else id="content">
            <router-link id="back" class="iconfont icon-back" to="/control-panel"></router-link>
            <router-view/>
        </div>
        <footer id="footer">
            <el-link class="iconfont icon-github" href="https://github.com/noah227/mini-online-tools">
                mini-online-tools
            </el-link>
            <!-- <el-link class="" href="javascript:void(0)">toxicu.com</el-link> -->
        </footer>
    </div>
</template>

<script>
import ComSvgLoader from "@/components/svg-loader.vue"
import {tools} from "@/router";

export default {
    components: {ComSvgLoader},
    data() {
        return {
            tools,
            toolName: "",
            showContent: false,
        }
    },
    watch: {
        "$route.path"() {
            this.updateStatus()
        }
    },
    methods: {
        updateStatus() {
            this.showContent = location.hash.split("/").length > 2
        }
    },
    created() {
        this.updateStatus()
    }
}
</script>

<style lang="scss" scoped>
div#control-panel {
    width: 100%;
    height: 100vh;
    padding: 3rem 0 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    > #title {
        text-align: center;
        padding-bottom: 1rem;
        box-sizing: border-box;
        box-shadow: 0 8px 6px -6px #aaa;
    }

    > div#item-list {
        width: 75%;
        flex-grow: 1;
        margin: 0 auto;
        padding: 3rem 0;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(auto-fill, 8.8rem);
        justify-content: center;
        justify-items: center;
        align-content: flex-start;
        grid-gap: 1.7rem;
        // display: grid;
        .tool-item {
            display: inline-block;
            width: 8.8rem;
            height: 8.8rem;
            padding: 1rem;
            box-sizing: border-box;
            box-shadow: 0 0 5px #aaa;
            transition: all ease-out .12s;

            &:hover {
                box-shadow: 0 0 8px #6af;
                transform: scale(1.05);
            }

            border-radius: .5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            cursor: pointer;
            user-select: none;

            .svg-icon {
                width: 3rem
            }

            .text {
                font-weight: bold;
            }
        }
    }

    > div#content {
        width: 75%;
        flex-grow: 1;
        margin: 0 auto;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        > #back {
            display: inline-block;
            position: absolute;
            left: 0;
            top: 2rem;
            width: 3rem;
            padding: 0 .8rem;
            font-size: 3rem;
            border-radius: .5rem;
            box-shadow: 0 0 3px #888;
            background-color: #fcfcfc;
            z-index: 333;
            cursor: pointer;
            transition: background-color linear .12s;

            &:hover {
                background-color: rgb(140 116 255);
                color: #fff;
            }
        }
    }

    > #footer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 5rem;
        font-size: 1.5rem !important;
        box-shadow: 0 -8px 6px -6px #aaa;

        .el-link {
            color: #6af;
            text-indent: .5rem;
            margin: 0 .5rem
        }
    }
}

a {
    //color: unset!important;
    color: unset;
    text-decoration: none;
}
@media screen and(max-width: 520px) {
    #item-list {
        display: grid!important;
        grid-template-columns: repeat(2, auto)!important;
        width: fit-content;
    }
}
@media screen and(max-width: 520px) {
    #control-panel {
        padding-top: 1rem !important;
    }
    #footer {
        height: 3rem !important;
    }
    #content {
        width: 100% !important;
    }
    > div#item-list {
        display: grid!important;
        grid-template-columns: repeat(2, auto);
        width: fit-content;
    }
    // todo这里要不要套个通用容器，子组件全部100%
    #content > div {
        width: 90% !important;
    }
    #back {
        display: none!important;
    }
}

</style>