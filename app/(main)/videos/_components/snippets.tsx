export interface Video {
    id: string;
    title: string;
    videoSrc: string;
    duration: any; // e.g., "05:30"
    isCompleted?: boolean;
}

export interface Chapter {
    id: string;
    title: string;
    videos: Video[];
    isCompleted?: boolean;
}

export interface Course {
    id: string;
    title: string;
    chapters: Chapter[];
}

export const formatSeconds = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num: number) => num.toString().padStart(2, "0");
    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
};

export function getTotalCourseTime(course: Course): string {
    const totalSeconds = course.chapters
        .flatMap((chapter) => chapter.videos)
        .reduce((sum, video) => sum + video.duration, 0);

    return formatSeconds(totalSeconds);
}

export const getTotalChapterTime = (chapter: Chapter): any => {
    const totalSeconds = chapter.videos.reduce(
        (acc, video: any) => acc + video.duration,
        0
    );
    return formatTimeMinutes(totalSeconds);
};

export const formatTimeMinutes = (totalSeconds: number): string => {
    if (totalSeconds < 60) {
        return `${totalSeconds} sec`;
    }
    const minutes = totalSeconds / 60;
    return `${minutes.toFixed(2)} min`;
};

export const isChapterComplete = (chapter: Chapter): boolean =>
    chapter.videos.every((video) => video.isCompleted);

export interface CoursesSidebarProps {
    courses: Course[];
    activeVideo: Video | null;
    setActiveVideo: (video: Video) => void;
}

export const getChapterCompletionPercentage = (
    chapter: CoursesSidebarProps["courses"][number]["chapters"][number]
) => {
    const total = chapter.videos.length;
    if (total === 0) return 0;
    const completed = chapter.videos.filter(
        (video) => video.isCompleted
    ).length;
    return (completed / total) * 100;
};