import {
    SimpleForm,
    Edit,
    FileInput,
    TextInput,
    required,
    ReferenceInput,
    NumberInput,
    FileField,
    useNotify,
    useRedirect,
} from "react-admin";
import React from "react";

export const VideoEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const handleUpload = async (values: any) => {
        const formData = new FormData();
        const file = values.videoSrc?.rawFile;

        if (file) {
            const blob = new Blob([file], { type: file.type });
            formData.append("video", blob, file.name);
        }

        formData.append("title", values.title);
        formData.append("videoId", values.id);
        formData.append("description", values.description);
        formData.append("chapterId", values.chapterId);
        formData.append("order", values.order);

        try {
            const response = await fetch(`/api/videos`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            notify("Video updated successfully", { type: "success" });
            redirect("list", "videos");
        } catch (error) {
            console.error(error);
            notify("Error updating video", { type: "error" });
        }
    };

    return (
        <Edit>
            <SimpleForm onSubmit={handleUpload}>
                <NumberInput
                    source="id"
                    label="Video ID"
                    validate={[required()]}
                />
                <TextInput
                    source="title"
                    validate={[required()]}
                    label="Title"
                />
                <TextInput
                    source="description"
                    validate={[required()]}
                    label="Description"
                />
                <ReferenceInput
                    source="chapterId"
                    reference="videosChapters"
                    label="Chapter"
                />
                <NumberInput
                    source="order"
                    validate={[required()]}
                    label="Order"
                />
                <FileInput
                    source="videoSrc"
                    label="Upload Video"
                    accept="video/*"
                >
                    <FileField source="src" title="title" />
                </FileInput>
            </SimpleForm>
        </Edit>
    );
};
