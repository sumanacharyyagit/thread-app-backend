import { prismaClient } from "../../lib/db";

const queries = {};
const mutations = {
    createUser: async (
        _: any,
        {
            firstName,
            lastName,
            email,
            password,
        }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
        }
    ): Promise<String> => {
        await prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password,
                salt: "random_salt",
            },
        });
        return "random_id";
    },
};

export const resolvers = { queries, mutations };
