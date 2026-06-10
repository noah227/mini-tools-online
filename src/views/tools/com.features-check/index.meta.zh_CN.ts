import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "features-check",
    text: "选项表生成",
    icon: "features-check",
    description: "类兼容表生成",
    devOnly: true,
    content: {
        labels: {
            checkedChar: "选中符号",
            uncheckedChar: "未选中符号"
        },
        buttons: {
            importJSON: "导入JSON",
            switchAxis: "交换轴",
            exportMarkdown: "导出Markdown",
            exportImage: "导出图片",
            exportJSON: "导出JSON"
        },
        placeholders: {
            inputX: "横轴字段，空格分隔",
            inputY: "纵轴字段，空格分隔"
        }
    }
}