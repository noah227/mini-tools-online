import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "features-check",
    text: "Features Checker",
    icon: "features-check",
    description: "Generate compatible tables like",
    devOnly: true,
    content: {
        labels: {
            checkedChar: "Checked Char",
            uncheckedChar: "Unchecked Char"
        },
        buttons: {
            importJSON: "Import JSON",
            switchAxis: "Switch Axis",
            exportMarkdown: "Export Markdown",
            exportImage: "Export Image",
            exportJSON: "Export JSON"
        },
        placeholders: {
            inputX: "X axis fields, use space to split",
            inputY: "Y axis fields, use space to split"
        }
    }
}