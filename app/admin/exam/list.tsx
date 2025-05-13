import { Datagrid, List, TextField, NumberField } from "react-admin";

export const ExamList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="topic" />
                <TextField source="category" />
                <NumberField source="order" />
            </Datagrid>
        </List>
    );
};
