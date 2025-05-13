import {
    SimpleForm,
    Create,
    TextInput,
    required,
    NumberInput,
    ReferenceInput,
} from "react-admin";

export const VideoChapterCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput
                    source="title"
                    validate={[required()]}
                    label="Title"
                />
                <ReferenceInput source="courseId" reference="courses" />
                <NumberInput
                    source="order"
                    validate={[required()]}
                    label="Order"
                />
            </SimpleForm>
        </Create>
    );
}