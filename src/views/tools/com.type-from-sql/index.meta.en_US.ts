import {TMetaStatic} from "@/types/common";

export const meta: TMetaStatic = {
    name: "type-from-sql",
    text: "Type from SQL",
    icon: "data-and-sql",
    description: "Extract types from sql for typescript/java field type definition",
    content: {
        labels: {
            databaseType: "Database Type",
            convertTo: "Convert To",
            convertStyle: "Convert Style",
            instantConvert: "Instant Convert"
        },
        buttons: {
            convert: "Convert",
            samples: "Samples",
            clearInput: "Clear Input",
            copyResult: "Copy Result"
        },
        checks: {
            regardDateAsString: "Regard Date as String"
        },
        switches: {
            extractTypes: "Types Extract",
            dataInit: "Data Init"
        }
    }
}