import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "json-structure-transformer",
    text: "JSON结构转换",
    icon: "json-structure-transformer",
    description: "对json进行拍平/逆拍平",
    content: {
        checks: {
            reverseSplit: "逆向拆分",
            compressOutput: "压缩结果"
        },
        placeholders: {
            input: "输入要处理的对象，如："
        }
    }
}