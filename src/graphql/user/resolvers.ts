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
