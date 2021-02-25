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
    useNotify,
    useRefresh,
    useRedirect,
    FormDataConsumer,
    ReferenceArrayInput,
    SelectArrayInput,
    useGetList,
    Loading,
} from "react-admin";
import RichTextInput from "ra-input-rich-text";
import { NumberInput } from "react-admin";
import { useFormState } from 'react-final-form';
import createDecorator from 'final-form-calculate'
import { createForm, getIn } from 'final-form'
import { format } from 'date-fns'

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import  zhTW  from 'date-fns/locale/zh-TW'

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
    <List {...props} filters={<ActivityFilter />} >
        <Datagrid rowClick="edit">
            <TextField source="名稱" />
            <ArrayField source="日期們">
                <Datagrid linkType="none">
                    <DateField source="日期" />
                </Datagrid>
            </ArrayField>
            <TextField source="地點" />
            <NumberField source="預計人數" />
            <NumberField source="預算" />
            <TextField source="負責人" />

            {/* <ShowButton label="" /> */}
            <EditButton label="" />
            {/* <DeleteButton label="" /> */}
        </Datagrid>
    </List>
);

export const ActivityShow = (props: any) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="名稱" />
            <ArrayField source="日期們">
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
            <ArrayInput source="日期們">
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
function calcSurvey(result: string) {
    const arr = result.split("\n")
    const total = arr.length
    let sums = [0, 0, 0, 0, 0, 0]
    for (let q of arr) {
        while (q.length < 6) {
            q = q.concat(q[q.length - 1])
        }

        for (let i = 0; i < 6; i++) {
            sums[i] += parseInt(q[i])
        }

    }
    const avgs = sums.map(sum => sum / total)
    return { total, avgs }
}
const calculator = createDecorator(
    {
        field: /\.問卷們/, // when minimum changes...
        // updates: {
        //     // ...update maximum to the result of this function
        //     '問卷.問卷們': (問卷, formData) => {
        //         console.log(問卷)
        //         const { total, avgs } = calcSurvey(問卷.問卷們)
        //         // @ts-ignore
        //         calcSurvey(問卷.問卷們).avgs[0].toFixed(2)

        //         return {
        //             問卷們: 問卷.問卷們,
        //             時程安排: avgs[0].toFixed(2),
        //             活動地點: avgs[1].toFixed(2),
        //             活動宣傳: avgs[2].toFixed(2),
        //             活動內容: avgs[3].toFixed(2),
        //             人員服務: avgs[4].toFixed(2),
        //             整體活動: avgs[5].toFixed(2),
        //         }
        //     }
        // }
        updates: (問卷們: string, name, allValues) => {
            const { total, avgs } = calcSurvey(問卷們)
            return {
                [name.replace('問卷們', '總數')]: total,
                [name.replace('問卷們', '時程安排')]: avgs[0].toFixed(2),
                [name.replace('問卷們', '活動地點')]: avgs[1].toFixed(2),
                [name.replace('問卷們', '活動宣傳')]: avgs[2].toFixed(2),
                [name.replace('問卷們', '活動內容')]: avgs[3].toFixed(2),
                [name.replace('問卷們', '人員服務')]: avgs[4].toFixed(2),
                [name.replace('問卷們', '整體活動')]: avgs[5].toFixed(2),

            }

        }
    },

)

export const ActivityEdit = (props: any) => {

    return (
        <Edit {...props}>
            <SimpleForm redirect="edit" decorators={[calculator]}>
                <NumberInput source="學年度" />
                <TextInput source="名稱" />
                <ArrayInput source="日期們">
                    <SimpleFormIterator>
                        <DateTimeInput source="開始日期" />
                        <DateTimeInput source="結束日期" />
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
                <ArrayInput source="承辦人員們">
                    <SimpleFormIterator>
                        <TextInput source="姓名" />

                    </SimpleFormIterator>
                </ArrayInput>

                <TextInput multiline source="問卷.問卷們" />
                <NumberField source="問卷.總數" />
                <NumberField source="問卷.時程安排" />
                <NumberField source="問卷.活動地點" />
                <NumberField source="問卷.活動宣傳" />
                <NumberField source="問卷.活動內容" />
                <NumberField source="問卷.人員服務" />
                <NumberField source="問卷.整體活動" />

                <GenerateDocxButtonField type="proposal" />
                <GenerateDocxButtonField type="report" />

                <a href="https://www.facebook.com/groups/249081999845754/media/albums" target="_blank">B09 社團相簿</a>
            </SimpleForm>

        </Edit>
    );
}
interface DateObject {
    開始日期: Date,
    結束日期: Date,
}
interface 承辦人員 {
    姓名: string,

}
interface Activity {
    學年度: number
    名稱: string
    日期們: Array<DateObject>
    地點: string
    預計人數: string
    預算: string
    目標: string
    參加對象: string
    主辦單位: string
    承辦人員們: Array<承辦人員>
    問卷: {
        總數: number,
        時程安排: number,
        活動地點: number,
        活動宣傳: number,
        活動內容: number,
        人員服務: number,
        整體活動: number,
    }
}
const defaultActivity: Activity = {
    學年度: 109,
    名稱: "",
    日期們: [],
    地點: "",
    預計人數: "",
    預算: "",
    目標: "",
    參加對象: "",
    主辦單位: "",
    承辦人員們: [],
    問卷: {
        總數: 0,
        時程安排: 5,
        活動地點: 5,
        活動宣傳: 5,
        活動內容: 5,
        人員服務: 5,
        整體活動: 5,
    }
}
const GenerateDocxButtonField = ({ type = "proposal", record = defaultActivity }) => {
    const users = useGetList(
        'users',
        { page: 1, perPage: 10 },
    );
    if (users.loading) { return <Loading />; }
    if (users.error) { return <p>users ERROR</p>; }

    function generateDocument() {
        const activity: Activity = record
        console.log(users.data)
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
                ...activity,
                日期們: activity.日期們.map(cur => ({ 開始日期: format(cur.開始日期, "yyyy/MM/dd(eeeeee) HH:mm", {locale: zhTW}), 結束日期: format(cur.結束日期, "HH:mm") })),
                承辦人員們: Object.values(users.data),
                ...activity.問卷,

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
            saveAs(out, `${format(activity.日期們[0].開始日期, "yyyyMMdd")} ${activity.名稱} ${type === 'report' ? '成果報告' : '企劃書'}.docx`);
        });
    };

    return (
        <button onClick={generateDocument}>生成{type === 'report' ? '成果報告' : '企劃書'}</button>

    )
}

