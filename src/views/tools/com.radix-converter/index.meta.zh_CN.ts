import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "radix-converter",
    text: "进制转换",
    icon: "string-converter",
    description: "各种进制之间的转换",
    faqList: [
        {
            title: "可以选择输入的部分内容进行转换"
        },
        {
            title: "转换可能存在精度限制，详见 <a href='https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt'>parseInt</a> 的用法说明"
        },
        {
            title: "选区事件监听用到了 <a href='https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/selectionchange_event'>selectionchange_event</a> ，旧版本浏览器和部分其他浏览器可能不生效"
        },
        {
            title: "该模块当前为测试版，转换结果仅供参考"
        }
    ],
    content: {
        labels: {
            inputRadix: "输入进制",
            inputLength: "输入长度",
            validInputLength: "有效输入长度",
            outputRadix: "输出进制"
        }
    }
}