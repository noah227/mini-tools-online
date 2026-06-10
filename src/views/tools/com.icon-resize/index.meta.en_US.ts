import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "icon-resize",
    text: "ICON Resize",
    icon: "resize",
    description: "Common sizes convert",
    faqList: [
        {
            title: "Square icon resize"
        },
        {
            title: "Sizes no more than input size will be selected"
        },
        {
            title: "<span style='color: #E6A23C'>Orange</span> means that the size is larger than input size"
        }
    ],
    content: {
        buttons: {
            addImage: "Add Image",
            downloadSelected: "Download Selected",
            downloadAll: "Download All"
        },
        checks: {
            all: "Check all"
        },
        legends: {
            customize: "Customize",
            commonSizes: "Common Sizes",
            operations: "Operations"
        }
    }
}