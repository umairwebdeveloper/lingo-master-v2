import {
    SimpleForm,
    Edit,
    TextInput,
    required,
    NumberInput,
} from "react-admin";

export const ExamEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="id" validate={[required()]} label="Id" />
                <TextInput
                    source="topic"
                    validate={[required()]}
                    label="Title"
                />
                <TextInput
                    source="category"
                    validate={[required()]}
                    label="Category"
                />
                <NumberInput source="order" validate={[required()]} label="Order" />
            </SimpleForm>
        </Edit>
    );
}