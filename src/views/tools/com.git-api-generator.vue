<template>
    <div id="git-api-generator">
        <HeadRender with-bottom-border></HeadRender>
        <div id="content-area">
            <div id="input">
                <div>
                    <label for="git-host">git主机</label>
                    <el-input id="git-host" v-model.trim="basicInput.host" placeholder="git主机"
                              title="git根地址">
                        <template #prepend>
                            <el-select v-model="basicInput.protocol" style="width: 88px;">
                                <el-option value="https" label="https://"></el-option>
                                <el-option value="http" label="http://"></el-option>
                            </el-select>
                        </template>
                    </el-input>
                </div>
                <div>
                    <label for="git-account">git账户</label>
                    <el-input id="git-account" v-model.trim="basicInput.account" placeholder="git账户"
                              title="git账户名"></el-input>
                </div>
            </div>
            <div id="output">
                <div>
                    <h3>User</h3>
                    <div v-for="(v, k) in renderData.user" class="api-item">
                        <span>{{ labelMap[k] || k }}</span>
                        <a :href="v">{{ v }}</a>
                        <a href="javascript:void(0)" title="复制" @click="_copyToClipboard(v)">📄</a>
                    </div>
                </div>
                <div>
                    <h3>
                        <span>Repository</span>
                        <el-input id="repository-name" v-model="repositoryInput.name" placeholder="仓库名称"></el-input>
                        <el-input id="repository-branch" v-model="repositoryInput.branch" placeholder="分支名称"></el-input>
                    </h3>
                    <div v-for="(v, k) in renderData.repository" class="api-item">
                        <span>{{ labelMap[k] || k }}</span>
                        <a :href="v">{{ v }}</a>
                        <a href="javascript:void(0)" title="复制" @click="_copyToClipboard(v)">📄</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import HeadRender from "@/components/head-render.vue"
import {computed, ref} from "vue";
import {copyToClipboard} from "@/utils";

defineOptions({
    name: "git-api-generator",
    text: "Git Api速览",
    icon: "git-api-generator",
    description: "Git常用API地址预览/生成",
    devOnly: true
})

const basicInput = ref({
    protocol: "https",
    host: "github.com",
    account: "xxx",
})

const repositoryInput = ref({
    name: "repo-name",
    branch: "master",
})

const gitUserRoot = computed(() => {
    const {host, account} = basicInput.value
    return [
        host.replace(/(\/)*/, "/"),
        account
    ].join("/")
})

const createPathHttp = (p: string) => {
    return `${basicInput.value.protocol}/${gitUserRoot.value}/${p}`
}

const createPathSSH = (p: string) => {
    return `git@${basicInput.value.host}/${gitUserRoot.value}/${p}`
}

const labelMap = {
    http: "仓库地址(http)",
    ssh: "仓库地址(ssh)",
    downloadZip: "仓库下载(zip)",
    issues: "Issues",
    PRs: "PRs",
    releases: "Releases",
}

const renderData = computed(() => {
    const {name: repo, branch} = repositoryInput.value
    return {
        user: {
            userInfo: createPathHttp("api/userinfo"),
            activities: createPathHttp("api/activities")
        },
        repository: {
            http: createPathHttp(repo + ".git"),
            ssh: createPathSSH(repo + ".git"),
            downloadZip: `${createPathHttp(repo)}/archive/refs/heads/${branch}.zip`,
            issues: createPathHttp("issues"),
            PRs: createPathHttp("pulls"),
            releases: createPathHttp("releases")
        }
    }
})

const _copyToClipboard = (v: string) => {
    copyToClipboard(v)
}

</script>

<style lang="scss">
div#git-api-generator {
    overflow: hidden;
    font-size: 14px;

    > div#content-area {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

    }

    div#input {
        display: flex;
        padding: 8px 12px;
        border-bottom: 1px solid #aaa;

        > div {
            display: flex;
            align-items: center;
            flex-grow: 1;

            > label {
                flex-shrink: 0;
                padding: 0 8px;
            }
        }
    }

    div#output {
        padding: 16px;

        > div {
            > h3 {
                > .el-input {
                    width: fit-content;
                    margin-left: 16px;
                }
            }

            > div {
                display: flex;
                align-items: center;

                > label {
                    flex-shrink: 0;
                    margin-right: 12px;
                }
            }
        }

        .api-item {
            &:not(:last-child) {
                margin-bottom: 12px;
            }

            > span:first-child {
                background-color: #f0f0f0;
                width: 90px;
                padding: 3px 6px;
                margin-right: 12px;
                user-select: none;
            }

            > a:nth-child(2) {
                color: cornflowerblue;
            }

            > a:last-child {
                margin-left: 6px;
                font-size: 12px;
            }
        }
    }

}
</style>
