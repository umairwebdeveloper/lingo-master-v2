import {
    Datagrid,
    List,
    NumberField,
    ReferenceField,
    SelectField,
    TextField,
    FileField,
} from "react-admin";
import { RaRecord } from "react-admin"; // Gebruik RaRecord in plaats van Record

export const ChallengeList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="question" />
                <SelectField
                    source="type"
                    choices={[
                        { id: "SELECT", name: "SELECT" },
                        { id: "ASSIST", name: "ASSIST" },
                    ]}
                />
                <NumberField source="order" />
                <ReferenceField source="lessonId" reference="lessons" />
                <FileField source="questionImageSrc" title="Image" />
            </Datagrid>
        </List>
    );
};
