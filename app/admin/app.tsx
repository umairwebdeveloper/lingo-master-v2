"use client";

import React, { useEffect } from "react";
import { Admin, Resource, CustomRoutes } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import { useRouter } from "next/navigation";
import { Route } from "react-router-dom";

import { CourseList } from "./course/list";
import { CourseCreate } from "./course/create";
import { CourseEdit } from "./course/edit";

import { VideoList } from "./video/list";
import { VideoCreate } from "./video/create";
import { VideoEdit } from "./video/edit";

import { videoChapterList } from "./videoChapter/list";
import { VideoChapterCreate } from "./videoChapter/create";
import { VideoChapterEdit } from "./videoChapter/edit";

import { ExamCreate } from "./exam/create";
import { ExamEdit } from "./exam/edit";
import { ExamList } from "./exam/list";

import QuizQuestionManager from "./quiz/question/page";

const dataProvider = simpleRestProvider("/api");

const QuestionsRedirect = () => {
    const router = useRouter();

    useEffect(() => {
        router.push("/questions");
    }, [router]);

    return null;
};

const App = () => {
    return (
        <Admin dataProvider={dataProvider}>
            <Resource
                name="courses"
                list={CourseList}
                recordRepresentation="title"
                create={CourseCreate}
                edit={CourseEdit}
            />
            <Resource
                name="videosChapters"
                list={videoChapterList}
                create={VideoChapterCreate}
                edit={VideoChapterEdit}
                recordRepresentation="title"
                options={{ label: "Video Chapters" }}
            />
            <Resource
                name="videos"
                list={VideoList}
                create={VideoCreate}
                edit={VideoEdit}
                recordRepresentation="title"
            />
            <Resource
                name="exams"
                list={ExamList}
                recordRepresentation="topic"
                create={ExamCreate}
                edit={ExamEdit}
            />
            <Resource
                name="questions"
                list={QuestionsRedirect}
                options={{ label: "Questions" }}
            />
            <CustomRoutes>
                <Route path="/questions" element={<QuizQuestionManager />} />
            </CustomRoutes>
        </Admin>
    );
};

export default App;
