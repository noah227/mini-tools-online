import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "url-query",
    text: "URL参数提取",
    icon: "url-query",
    description: "URL参数提取",
    content: {
        checks: {
            decodeParams: "解码参数值",
            compressResult: "压缩结果",
            allowMultiValue: "允许多值参数"
        },
        placeholders: {
            input: "请输入要提取参数的URL地址"
        },
        titles: {
            decodeTimes: "解码次数"
        }
    }
}