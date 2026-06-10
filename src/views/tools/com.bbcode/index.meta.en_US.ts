import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "bbcode",
    text: "bbcode",
    icon: "code",
    description: "bbcode online edit and preview",
    faqList: [
        {
            title: "About bbcode",
            link: "https://www.bbcode.org/reference.php"
        },
        {
            title: "bbcode may perform different between platforms"
        }
    ],
    content: {
        checks: {
            recognizeBlankLine: "Recognize blank line"
        },
        options: {
            horizontal: "Horizontal",
            vertical: "Vertical"
        }
    }
}