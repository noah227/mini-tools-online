import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "url-query",
    text: "URL Params",
    icon: "url-query",
    description: "Extract parameters from URL",
    content: {
        checks: {
            decodeParams: "Decode Params",
            compressResult: "Compress Result",
            allowMultiValue: "Allow multi-value param"
        },
        placeholders: {
            input: "Input url here"
        },
        titles: {
            decodeTimes: "Decode Times"
        }
    }
}