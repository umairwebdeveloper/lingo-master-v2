"use client";

import { courses, userProgress } from "@/db/schema";
import React, { useTransition } from "react";
import Card from "./card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRedirectIfNoPayment } from "@/lib/useRedirectIfNoPayment";

type Props = {
    courses: (typeof courses.$inferSelect)[];
};

const List = ({ courses }: Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    // const { loading } = useRedirectIfNoPayment();

    // if (loading) {
    //     return <div className="text-center mt-5">Loading...</div>;
    // }

    const onClick = (id: number) => {
        if (pending) return;
        startTransition(() => {
            router.push(`/videos/${id}`);
        });
    };
    return (
        <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
            {courses.map((course) => (
                <Card
                    title={course.title}
                    id={course.id}
                    key={course.id}
                    imageSrc={course.imageSrc}
                    onClick={onClick}
                    disabled={pending}
                />
            ))}
        </div>
    );
};

export default List;
