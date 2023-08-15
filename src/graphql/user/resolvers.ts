import { prismaClient } from "../../lib/db";
import UserService, { ICreateUserPayload } from "../../services/user";

const queries = {
    getUserToken: async (
        _: any,
        payload: { email: string; password: string }
    ) => {
        const token = await UserService.getUserToken({
            email: payload.email,
            password: payload.password,
        });
        return token;
    },
    getCurrentLoggedinUser: async (_: any, parameters: any, context: any) => {
        if (context && context.user) {
            const id = context.user.id;
            const user = await UserService.getUserById(id);
            return user;
        }
        throw new Error("Nothing");
    },
};
const mutations = {
    createUser: async (
        _: any,
        payload: ICreateUserPayload
    ): Promise<String> => {
        const resp = await UserService.createUser(payload);
        return resp.id;
    },
};

export const resolvers = { queries, mutations };
