import db from "@/db/drizzle";
import { questions, userAnswers } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";

function transformQuestion(questionA: any) {
    let newType = "";
    if (questionA.question_type === "multiple-choice") {
        newType = "multiple";
    } else if (questionA.question_type === "fill-in-the-blank") {
        newType = "fill";
    } else if (questionA.question_type === "multiple-choice-with-image") {
        newType = "multiple-choice-with-image";
    }

    const transformed: any = {
        id: questionA.id,
        type: newType,
        questionText: questionA.question,
        questionDetail: questionA.description || "",
        imageUrl: questionA.image || "",
        explanation: questionA.explanation,
        category: questionA.category,
    };

    if (newType === "multiple") {
        transformed.choices = questionA.options.map((option: string) => ({
            text: option,
            isCorrect: option === questionA.correctAnswer,
        }));
    } else if (newType === "fill") {
        transformed.correctAnswer = questionA.correctAnswer;
    } else if (newType === "multiple-choice-with-image") {
        transformed.choices = questionA.options.map(
            (option: string, index: number) => ({
                text: option,
                image:
                    questionA.imageOptions && questionA.imageOptions[index]
                        ? questionA.imageOptions[index]
                        : "",
                isCorrect: option === questionA.correctAnswer,
            })
        );
    }

    return transformed;
}

export const GET = async (req: Request) => {
    const url = new URL(req.url);
    const topicId = url.searchParams.get("topicId"); // Get the topicId from query params
    const changeFormat = url.searchParams.get("format"); // Get the topicId from query params

    try {
        let data;

        if (topicId) {
            data = await db
                .select()
                .from(questions)
                .where(eq(questions.topicId, Number(topicId)))
                .orderBy(questions.id);
        } else {
            // Fetch all questions if topicId is not provided
            data = await db.query.questions.findMany({
                orderBy: [questions.id],
            });
        }

        // await db.delete(userAnswers);
        if (changeFormat) {
            const questionsB = data.map(transformQuestion);
            return NextResponse.json(questionsB);
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

async function uploadImageToVercelBlob(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    const image = await put(fileName, file, { access: "public" });
    return image.url;
}

export const POST = async (req: Request) => {
    try {
        // Parse the incoming multipart/form-data request.
        const formData = await req.formData();

        // Extract fields from the form data.
        const question_type: any = formData.get("question_type")?.toString();
        const question = formData.get("question")?.toString();
        const optionsStr = formData.get("options")?.toString();
        const options = optionsStr ? JSON.parse(optionsStr) : [];
        const correctAnswer = formData.get("correctAnswer")?.toString();
        const explanation = formData.get("explanation")?.toString();
        const topicId = formData.get("topicId")?.toString();
        const category: any = formData.get("category")?.toString();
        const description = formData.get("description")?.toString() || "";
        let imageUrl: string | null = null;

        // Validate required fields.
        if (
            !question_type ||
            !question ||
            !correctAnswer ||
            !explanation ||
            !topicId
        ) {
            return new NextResponse("Bad Request: Missing required fields", {
                status: 400,
            });
        }

        // If an image was uploaded, process the file.
        const imageFile = formData.get("image");
        if (imageFile && imageFile instanceof File) {
            imageUrl = await uploadImageToVercelBlob(imageFile);
        }

        // Process option images (for multiple-choice-with-image)
        // Retrieve all files with the key "optionImages[]"
        const optionImageFiles = formData.getAll("optionImages[]");
        const imageOptions: string[] = [];
        if (optionImageFiles && optionImageFiles.length > 0) {
            for (const file of optionImageFiles) {
                if (file && file instanceof File) {
                    const url = await uploadImageToVercelBlob(file);
                    imageOptions.push(url);
                }
            }
        }

        // Insert the new question into the database.
        const data = await db
            .insert(questions)
            .values({
                question_type: question_type,
                category: category,
                question: question,
                description: description,
                options: options,
                correctAnswer: correctAnswer,
                explanation: explanation,
                image: imageUrl,
                topicId: Number(topicId),
                imageOptions: imageOptions,
            })
            .returning();

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        return new NextResponse(error.message || "Internal Server Error", {
            status: 500,
        });
    }
};

export const PUT = async (req: Request) => {
    try {
        const formData = await req.formData();

        // Extract fields from the form data.
        const id = formData.get("id")?.toString();
        const question_type = formData.get("question_type")?.toString();
        const question = formData.get("question")?.toString();
        const optionsStr = formData.get("options")?.toString();
        const options = optionsStr ? JSON.parse(optionsStr) : [];
        const correctAnswer = formData.get("correctAnswer")?.toString();
        const explanation = formData.get("explanation")?.toString();
        const topicId = formData.get("topicId")?.toString();
        const description = formData.get("description")?.toString() || "";
        const category = formData.get("category")?.toString();
        let imageUrl: string | null = null;

        if (!id) {
            return new NextResponse("Bad Request: Missing question ID", {
                status: 400,
            });
        }

        // Prepare the update data.
        const updateData: Record<string, any> = {
            question_type,
            question,
            options,
            correctAnswer,
            explanation,
            topicId,
            description,
            category,
        };

        // If a new image file was provided, upload it and add the URL to the update data.
        const imageFile = formData.get("image");
        if (imageFile && imageFile instanceof File) {
            imageUrl = await uploadImageToVercelBlob(imageFile);
            updateData.image = imageUrl;
        }

        // Process option images if provided.
        const optionImageFiles = formData.getAll("optionImages[]");
        if (optionImageFiles && optionImageFiles.length > 0) {
            const imageOptions: string[] = [];
            for (const file of optionImageFiles) {
                if (file && file instanceof File) {
                    const url = await uploadImageToVercelBlob(file);
                    imageOptions.push(url);
                }
            }
            // Update the imageOptions field with the new URLs.
            updateData.imageOptions = imageOptions;
        }

        // Update the question in the database.
        const data = await db
            .update(questions)
            .set(updateData)
            .where(eq(questions.id, Number(id)))
            .returning();

        if (!data.length) {
            return new NextResponse("Not Found: Question not found", {
                status: 404,
            });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return new NextResponse(error.message || "Internal Server Error", {
            status: 500,
        });
    }
};

export const DELETE = async (req: Request) => {
    const body = await req.json();
    const { id } = body; // Question ID to delete

    // Validate required fields
    if (!id) {
        return new NextResponse("Bad Request: Missing question ID", {
            status: 400,
        });
    }

    // Delete the question
    const data = await db
        .delete(questions)
        .where(eq(questions.id, id)) // Use `eq` to construct the condition
        .returning();

    if (!data.length) {
        return new NextResponse("Not Found: Question not found", {
            status: 404,
        });
    }

    return NextResponse.json(
        { success: true, message: "Question deleted" },
        { status: 200 }
    );
};
