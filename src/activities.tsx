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
                    <DateInput source="日期" />
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

export const ActivityEdit = (props: any) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="名稱" />
            <ArrayInput source="日期">
                <SimpleFormIterator>
                    <DateInput source="日期" />
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

    </Edit>
);
