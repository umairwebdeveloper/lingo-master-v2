import {
    SimpleForm,
    Edit,
    TextInput,
    required,
    NumberInput,
    ReferenceInput,
} from "react-admin";

export const VideoChapterEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="id" validate={[required()]} label="Id" />
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
        </Edit>
    );
}