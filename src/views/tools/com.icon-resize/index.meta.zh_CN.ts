import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
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
    ],
    content: {
        buttons: {
            addImage: "添加图片",
            downloadSelected: "下载已选择",
            downloadAll: "下载所有"
        },
        checks: {
            all: "全选"
        },
        legends: {
            customize: "自定义",
            commonSizes: "常用尺寸",
            operations: "操作"
        }
    }
}