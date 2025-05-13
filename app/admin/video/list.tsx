import { Datagrid, List, ReferenceField, TextField, FileField } from "react-admin";

export const VideoList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="order" />
                <TextField source="description" />
                <ReferenceField source="chapterId" reference="videosChapters" />
                <FileField source="videoSrc" title="videotitle" />
            </Datagrid>
        </List>
    );
}