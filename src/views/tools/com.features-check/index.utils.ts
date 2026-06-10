export const createMdTableRowFromStringList = (sList: string[], fillSpace = true) => {
    const fillChar = fillSpace ? " " : ""
    return `|${fillChar}${sList.join(`${fillChar}|${fillChar}`)}${fillChar}|`
}