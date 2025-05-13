import {
    SimpleForm,
    Create,
    TextInput,
    FileInput,
    required,
    ReferenceInput,
    NumberInput,
    FileField,
    useNotify,
} from "react-admin";

export const VideoCreate = () => {
    const notify = useNotify();

    const getVideoDuration = (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const video = document.createElement("video");
            video.preload = "metadata";
            video.src = url;
            video.onloadedmetadata = () => {
                URL.revokeObjectURL(url);
                resolve(video.duration);
            };
            video.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Error loading video metadata"));
            };
        });
    };

    const handleUpload = async (values: any) => {
        const formData = new FormData();
        const file = values.video.rawFile;

        const duration = await getVideoDuration(file);

        const blob = new Blob([file], { type: file.type });
        formData.append("video", blob, file.name);
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("chapterId", values.chapterId);
        formData.append("order", values.order);
        formData.append("duration", duration.toString());

        try {
            const response = await fetch("/api/videos", {
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
                    source="title"
                    validate={[required()]}
                    label="Title"
                />
                <TextInput
                    source="description"
                    validate={[required()]}
                    label="Description"
                />
                <ReferenceInput source="chapterId" reference="videosChapters" />
                <NumberInput
                    source="order"
                    validate={[required()]}
                    label="Order"
                />
                <FileInput
                    source="video"
                    label="Video File"
                    accept="video/*"
                    validate={[required()]}
                >
                    <FileField source="src" title="title" />
                </FileInput>
            </SimpleForm>
        </Create>
    );
};
