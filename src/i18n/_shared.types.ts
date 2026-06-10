export type TI18nData = {
    // for website global
    site?: {
        title: string
        description: string
    }
    head: {
        title: string
    }
    body: {
        search: {
            placeholder: string
        },
        common: {
            buttons: Record<string, string>
            placeholders: Record<string, string>
        }
    }
    foot?: {}
}