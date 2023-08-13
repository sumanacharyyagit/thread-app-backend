import { ApolloServer } from "@apollo/server";
import { prismaClient } from "../lib/db";
import { User } from "./user";

async function apoloGraphQlServer() {
    // CREATE a GrapgQL Server
    const gqlServer = new ApolloServer({
        typeDefs: `
                type Query {
                    hello: String
                    say(name: String): String
                    ${User.queries}
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
