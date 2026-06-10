import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "bbcode",
    text: "bbcode",
    icon: "code",
    description: "bbcode在线编辑与预览",
    faqList: [
        {
            title: "关于bbcode",
            link: "https://www.bbcode.org/reference.php"
        },
        {
            title: "bbcode在不同的平台上的支持可能还不是很一致"
        }
    ],
    content: {
        checks: {
            recognizeBlankLine: "识别空白行"
        },
        options: {
            horizon: "横向",
            vertical: "纵向"
        }
    }
}