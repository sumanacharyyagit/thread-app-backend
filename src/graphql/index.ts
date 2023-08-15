import { ApolloServer } from "@apollo/server";
import { prismaClient } from "../lib/db";
import { User } from "./user";

async function apoloGraphQlServer() {
    // CREATE a GrapgQL Server
    const gqlServer = new ApolloServer({
        typeDefs: `
                ${User.typeDefs}
                type Query {
                    hello: String
                    say(name: String): String
                    ${User.queries}
                    getContext: String 
                }
                type Mutation {
                    ${User.mutations}
                }
            `,
        resolvers: {
            Query: {
                hello: () => "hello there",
                say: (_, { name }: { name: String }) => `Hey welcome ${name}`,
                ...User.resolvers.queries,
                getContext: (_: any, parameters: any, context: any) => {
                    console.log(context, "Context");
                    return "OKAAAYYYYY";
                },
            },
            Mutation: {
                ...User.resolvers.mutations,
            },
        },
    });

    // Start GrapgQL Server
    await gqlServer.start();

    return gqlServer;
}

export default apoloGraphQlServer;
