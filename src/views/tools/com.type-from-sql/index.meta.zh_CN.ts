import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "type-from-sql",
    text: "sql字段提取",
    icon: "data-and-sql",
    description: "从sql字段定义获取typescript/java类型定义",
    content: {
        labels: {
            databaseType: "数据库类型",
            convertTo: "转换到",
            convertStyle: "转换风格",
            instantConvert: "实时转换"
        },
        buttons: {
            convert: "转换内容",
            samples: "示例输入",
            clearInput: "清空输入",
            copyResult: "复制结果"
        },
        checks: {
            regardDateAsString: "Date视为String"
        },
        switches: {
            extractTypes: "类型提取",
            dataInit: "数据初始化"
        }
    }
}