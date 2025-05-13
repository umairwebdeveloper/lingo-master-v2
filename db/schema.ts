import { relations } from "drizzle-orm";
import {
    serial,
    pgTable,
    text,
    integer,
    pgEnum,
    boolean,
    timestamp,
    varchar,
    jsonb,
    json,
    numeric,
} from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src"),
});

export const coursesRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units),
}));

export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    courseId: integer("course_id")
        .references(() => courses.id, { onDelete: "cascade" })
        .notNull(),
    order: integer("order").notNull(),
});

export const unitRelations = relations(units, ({ many, one }) => ({
    course: one(courses, {
        fields: [units.courseId],
        references: [courses.id],
    }),
    lessons: many(lessons),
}));

export const videoChapters = pgTable("video_chapters", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    courseId: integer("course_id").references(() => courses.id, {
        onDelete: "cascade",
    }),
    order: integer("order"),
});

export const videos = pgTable("videos", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    chapterId: integer("chapter_id").references(() => videoChapters.id, {
        onDelete: "cascade",
    }),
    order: integer("order"),
    videoSrc: text("video_src").notNull(),
    duration: integer("duration"),
});

export const userVideos = pgTable("user_videos", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    videoId: integer("video_id")
        .references(() => videos.id, {
            onDelete: "cascade",
        })
        .notNull(),
    isCompleted: boolean("is_completed").default(false).notNull(),
    views: integer("views").default(0).notNull(),
    watchTime: integer("watch_time").default(0).notNull(),
    lastWatchedAt: timestamp("last_watched_at").defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    unitId: integer("unit_id")
        .references(() => units.id, { onDelete: "cascade" })
        .notNull(),
    order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    unit: one(units, {
        fields: [lessons.unitId],
        references: [units.id],
    }),
    challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    question: text("question").notNull(),
    lessonId: integer("lesson_id")
        .references(() => lessons.id, { onDelete: "cascade" })
        .notNull(),
    type: challengesEnum("type").notNull(),
    order: integer("order").notNull(),
    explanation: text("explanation"),
    questionImagesrc: text("image_src"),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
    lesson: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id],
    }),
    challengeOptions: many(challengeOptions),
    challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options", {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id")
        .references(() => challenges.id, { onDelete: "cascade" })
        .notNull(),
    text: text("text").notNull(),
    correct: boolean("correct").notNull(),
    imageSrc: text("image_src"),
    audioSrc: text("audio_src"),
});
export const challengeOptionsRelations = relations(
    challengeOptions,
    ({ one, many }) => ({
        lesson: one(challenges, {
            fields: [challengeOptions.challengeId],
            references: [challenges.id],
        }),
    })
);

export const challengeProgress = pgTable("challenges_progress", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    challengeId: integer("challenge_id")
        .references(() => challenges.id, { onDelete: "cascade" })
        .notNull(),
    completed: boolean("completed").notNull(),
});

export const challengeProgressRelations = relations(
    challengeProgress,
    ({ one }) => ({
        lesson: one(challenges, {
            fields: [challengeProgress.challengeId],
            references: [challenges.id],
        }),
    })
);

export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
    activeCourseId: integer("active_course_id").references(() => courses.id, {
        onDelete: "cascade",
    }),
    hearts: integer("hearts").notNull().default(5),
    points: integer("points").notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id],
    }),
}));

export const userSubscription = pgTable("user_subscription", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    stripeCustomerId: text("stripe_customer_id").notNull().unique(),
    stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
    stripePriceId: text("stripe_price_id").notNull(),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});

export const questionTypeEnum = pgEnum("question_type", [
    "multiple-choice",
    "fill-in-the-blank",
    "multiple-choice-with-image",
]);

export const topicStatus = pgEnum("topic_status", [
    "Open",
    "Geslaagd",
    "Gezakt",
]);

export const topics = pgTable("topics", {
    id: serial("id").primaryKey(),
    topic: varchar("topic", { length: 255 }).notNull(),
    topicImage: varchar("topic_image", { length: 512 }),
    category: text("category"),
    status: topicStatus("status"),
    order: integer("order"),
});

export const questionCategoryEnum = pgEnum("question_category", [
    "Hazard Recognition",
    "Knowledge",
    "Insight",
]);

export const questions = pgTable("questions", {
    id: serial("id").primaryKey(),
    question_type: questionTypeEnum("question_type").notNull(),
    category: questionCategoryEnum("question_category"),
    question: text("question").notNull(),
    description: text("description"),
    options: jsonb("options").default([]),
    imageOptions: jsonb("image_options").default([]),
    correctAnswer: text("correct_answer").notNull(),
    explanation: text("explanation").notNull(),
    image: varchar("image", { length: 512 }),
    topicId: serial("topic_id")
        .references(() => topics.id, { onDelete: "cascade" }) // Add onDelete cascade
        .notNull(),
    order: integer("order"),
});

export const userAnswers = pgTable("user_answers", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    questionId: integer("question_id") // Question ID
        .references(() => questions.id, { onDelete: "cascade" })
        .notNull(),
    selectedAnswer: text("selected_answer").notNull(), // User's selected answer
    isCorrect: varchar("is_correct", { length: 5 }).notNull().default("false"), // Boolean stored as string
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const userStreak = pgTable("user_streak", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    streakCount: integer("streak_count").default(0).notNull(),
    lastLoginDate: timestamp("last_login_date"),
    weekdaysActive: json("weekdays_active").default([]),
    lastWeekDate: timestamp("last_week_date"),
});

export const payments = pgTable("payments", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    amount: numeric("amount").notNull(),
    currency: varchar("currency", { length: 10 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    planType: varchar("plan_type", { length: 50 }),
    extraDays: integer("extra_days").default(0).notNull(),
    extraDaysDate: timestamp("extra_days_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userTime = pgTable("user_time", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    date: timestamp("date").defaultNow().notNull(),
    timeSpent: integer("time_spent").notNull(),
});
