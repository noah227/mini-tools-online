import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "radix-converter",
    text: "Radix Converter",
    icon: "string-converter",
    description: "Convert number between radixes",
    faqList: [
        {
            title: "Selection input is supported"
        },
        {
            title: "Precision issues may exist，see about <a href='https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt'>parseInt</a>"
        },
        {
            title: "Use <a href='https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/selectionchange_event'>selectionchange_event</a> to watch selection change，need modern browsers to support"
        },
        {
            title: "Beta module for test, Do NOT RELY on it's accuracy"
        }
    ],
    content: {
        labels: {
            inputRadix: "Input Radix",
            inputLength: "Input Length",
            validInputLength: "Valid Input Length",
            outputRadix: "Output Radix"
        }
    }
}