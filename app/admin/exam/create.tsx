import {
    SimpleForm,
    Create,
    TextInput,
    required,
    NumberInput,
} from "react-admin";

export const ExamCreate = () => {
    return (
        <Create>
            <SimpleForm>
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
        </Create>
    );
}