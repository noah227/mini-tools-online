import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "json-structure-transformer",
    text: "JSON Convert",
    icon: "json-structure-transformer",
    description: "(un)pat json content",
    content:{
        checks: {
            reverseSplit: "Reverse Split",
            compressOutput: "Compress Output"
        },
        placeholders: {
            input: "Input object to process, e.g, ",
        }
    }
}