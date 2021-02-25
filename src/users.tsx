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
    FileInput
} from "react-admin";
import RichTextInput from "ra-input-rich-text";

const UserFilter = (props: any) => {
    return (<Filter {...props}>
        <TextInput label="Search" source="title" alwaysOn />
    </Filter>);
};

export const UserList = (props: any) => (
    <List {...props} filters={<UserFilter />}>
        <Datagrid rowClick="edit">
            <TextField source="職稱" />
            <TextField source="姓名" />
            <EditButton label="" />
            <DeleteButton label="" />
        </Datagrid>
    </List>
);

export const UserShow = (props: any) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <RichTextField source="body" />
            <FileField source="file.src" title="file.title" />
        </SimpleShowLayout>
    </Show>
);

export const UserCreate = (props: any) => (
    <Create {...props}>
        <SimpleForm>
            {/* <DisabledInput source="id" /> */}
            <SelectInput
                source="職稱"
                choices={[
                    { id: "男一舍同儕團體", name: "男一舍同儕團體" },
                    { id: "男一舍生治會總幹事", name: "男一舍生治會總幹事" },
                    { id: "男一舍宿舍輔導員", name: "男一舍宿舍輔導員" }
                ]}
            />
            <TextInput source="姓名" />
        </SimpleForm>
    </Create>
);

export const UserEdit = (props: any) => (
    <Edit {...props}>
        <SimpleForm>
            {/* <DisabledInput source="id" /> */}
            <SelectInput
                source="職稱"
                choices={[
                    { id: "男一舍同儕團體", name: "男一舍同儕團體" },
                    { id: "男一舍生治會總幹事", name: "男一舍生治會總幹事" },
                    { id: "男一舍宿舍輔導員", name: "男一舍宿舍輔導員" }
                ]}
            />
            <TextInput source="姓名" />
        </SimpleForm>
    </Edit>
);
