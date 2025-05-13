import {
    SimpleForm,
    Create,
    TextInput,
    required,
    ReferenceInput,
    NumberInput,
    SelectInput,
    FileInput,
    FileField,
    useNotify,
} from "react-admin";

export const ChallengeCreate = () => {
    const notify = useNotify();

    const handleUpload = async (values: any) => {
        const formData = new FormData();
        const file = values.questionImageSrc.rawFile;
        const blob = new Blob([file], { type: file.type });
        formData.append("image", blob, file.name);
        formData.append("type", values.type);
        formData.append("question", values.question);
        formData.append("explanation", values.explanation);
        formData.append("lessonId", values.lessonId);
        formData.append("order", values.order);

        try {
            const response = await fetch("/api/challenges", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");
            notify("Video uploaded successfully", { type: "success" });
        } catch (error) {
            console.error(error);
            notify("Error uploading video", { type: "error" });
        }
    };
    return (
        <Create>
            <SimpleForm onSubmit={handleUpload}>
                <TextInput
                    source="question"
                    validate={[required()]}
                    label="Question"
                />
                <ReferenceInput source="lessonId" reference="lessons" />
                <SelectInput
                    source="type"
                    validate={[required()]}
                    label="Type"
                    choices={[
                        { id: "SELECT", name: "SELECT" },
                        { id: "ASSIST", name: "ASSIST" },
                    ]}
                />
                <NumberInput
                    source="order"
                    validate={[required()]}
                    label="Order"
                />
                <FileInput
                    source="questionImageSrc"
                    label="Image"
                    accept="image/*"
                >
                    <FileField source="src" title="title" />
                </FileInput>
                <TextInput
                    source="explanation"
                    label="Explanation"
                    multiline // Allows for longer text input
                />
            </SimpleForm>
        </Create>
    );
};
