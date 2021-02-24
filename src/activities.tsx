// in src/posts.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
    Datagrid,
    List,
    Show,
    Create,
    Edit,
    Filter,
    // DisabledInput,
    SimpleShowLayout,
    SimpleForm,
    TextField,
    TextInput,
    ShowButton,
    EditButton,
    DeleteButton,
    RichTextField,
    SelectInput,
    FileField,
    FileInput,
    ArrayField,
    DateField,
    ArrayInput,
    DateInput,
    SimpleFormIterator,
    NumberField,
    DateTimeInput,
    SingleFieldList,
} from "react-admin";
import RichTextInput from "ra-input-rich-text";
import { NumberInput } from "react-admin";

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";

function loadFile(url: any, callback: any) {
    PizZipUtils.getBinaryContent(url, callback);
}

function replaceErrors(key: any, value: any) {
    if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce(function (
            error: any,
            key: any
        ) {
            // @ts-ignore
            error[key] = value[key];
            return error;
        },
            {});
    }
    return value;
}

const ActivityFilter = (props: any) => {
    return (<Filter {...props}>
        <TextInput label="Search" source="title" alwaysOn />
    </Filter>);
};

export const ActivityList = (props: any) => (
    <List {...props} filters={<ActivityFilter />}>
        <Datagrid>
            <TextField source="名稱" />
            <ArrayField source="日期">
                <Datagrid linkType="none">
                    <DateField source="日期" />
                </Datagrid>
            </ArrayField>
            <TextField source="地點" />
            <NumberField source="預計人數" />
            <NumberField source="預算" />
            <TextField source="負責人" />

            <ShowButton label="" />
            <EditButton label="" />
            <DeleteButton label="" />
        </Datagrid>
    </List>
);

export const ActivityShow = (props: any) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="名稱" />
            <ArrayField source="日期">
                <Datagrid>
                    <DateField source="日期" />
                </Datagrid>
            </ArrayField>
            <TextField source="地點" />
            <NumberField source="預計人數" />
            <NumberField source="預算" />
            <TextField source="負責人" />


            <RichTextField source="描述" />
        </SimpleShowLayout>
    </Show>
);

const defaultValue = () => ({ 主辦單位: "學務處住宿組男生第一宿舍" });

export const ActivityCreate = (props: any) => (
    <Create {...props}>
        <SimpleForm initialValues={defaultValue}>
            <TextInput source="名稱" />
            <ArrayInput source="日期">
                <SimpleFormIterator>
                    <DateTimeInput source="日期" />
                </SimpleFormIterator>
            </ArrayInput>
            <TextInput source="地點" />
            <NumberInput source="預計人數" />
            <NumberInput source="預算" />

            <SelectInput source="負責人" choices={[
                { id: '瀚文', name: '瀚文' },
                { id: '璽元', name: '璽元' },
            ]} />

            <TextInput multiline source="目標" />
            <TextInput source="參加對象" />
            <TextInput source="主辦單位" />
        </SimpleForm>

    </Create>
);

export const ActivityEdit = (props: any) => {


    return (
        <Edit {...props}>
            <SimpleForm>
                <TextInput source="名稱" />
                <ArrayInput source="日期">
                    <SimpleFormIterator>
                        <DateTimeInput source="日期" />
                    </SimpleFormIterator>
                </ArrayInput>
                <TextInput source="地點" />
                <NumberInput source="預計人數" />
                <NumberInput source="預算" />

                <SelectInput source="負責人" choices={[
                    { id: '瀚文', name: '瀚文' },
                    { id: '璽元', name: '璽元' },
                ]} />

                <TextInput multiline source="目標" />
                <TextInput source="參加對象" />
                <TextInput source="主辦單位" />
                <GenerateDocxButtonField type="proposal"/>
                <GenerateDocxButtonField type="report"/>
            </SimpleForm>

        </Edit>
    );
}
interface DateObject {
    日期: string,
}
interface Activity {
    學年度: number
    名稱: string
    日期: Array<DateObject>
    地點: string
    預計人數: string
    預算: string
    目標: string
    參加對象: string
    主辦單位: string
}
const defaultActivity: Activity = {
    學年度: 109,
    名稱: "",
    日期: [],
    地點: "",
    預計人數: "",
    預算: "",
    目標: "",
    參加對象: "",
    主辦單位: "",
}
const GenerateDocxButtonField = ({ type = "proposal", record = defaultActivity }) => {
    function generateDocument() {
        const activity: Activity = record
        loadFile(`./templates/${type}.docx`, function (
            error: any,
            content: any
        ) {
            if (error) {
                throw error;
            }
            var zip = new PizZip(content);
            var doc = new Docxtemplater().loadZip(zip);
            doc.setData({
                ...activity, 日期: activity.日期.toString()
            });
            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render();
            } catch (error) {
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).

                console.log(JSON.stringify({ error: error }, replaceErrors));

                if (error.properties && error.properties.errors instanceof Array) {
                    const errorMessages = error.properties.errors
                        .map(function (error: any) {
                            return error.properties.explanation;
                        })
                        .join("\n");
                    console.log("errorMessages", errorMessages);
                    // errorMessages is a humanly readable message looking like this :
                    // 'The tag beginning with "foobar" is unopened'
                }
                throw error;
            }
            var out = doc.getZip().generate({
                type: "blob",
                mimeType:
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            }); //Output the document using Data-URI
            saveAs(out, `${activity.日期[0].日期} ${activity.名稱} ${type === 'report' ? '成果報告' : '企劃書'}.docx`);
        });
    };

    return (
        <button onClick={generateDocument}>生成{type === 'report' ? '成果報告' : '企劃書'}</button>

    )
}

