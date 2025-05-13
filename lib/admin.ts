import { auth } from "@clerk/nextjs";

const adminIds = [
    "user_2qKk8kQ2GLq7AZHTumgBpcExl1d",
    "user_2r4nbQNjZ6jbUQpf0vdFLSooq1O",
    "user_2tltVr7ZLcn898eqtbYUsdEt5A7",
];

export const isAdmin = () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    return adminIds.indexOf(userId) !== -1;
};
