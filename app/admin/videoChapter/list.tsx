import { Datagrid, List, TextField, ReferenceField } from "react-admin";

export const videoChapterList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="title" />
                <ReferenceField source="courseId" reference="courses" />
                <TextField source="order" />
            </Datagrid>
        </List>
    );
};
