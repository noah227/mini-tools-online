import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "color-converter",
    text: "颜色快速转换",
    icon: "palette",
    description: "颜色快速转换及预览(Based on color-convert@npm)",
    faqList: [
        {
            title: "Why do the LCH and LAB conversion results differ from those on Chrome?",
            link: "https://github.com/Qix-/color-convert/issues/108"
        },
        {
            title: "当前模块功能尚不完整，仅部分输入转换可用"
        }
    ]
}