import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function init() {
    const app = express();

    const PORT = Number(process.env.PORT) || 8080;

    app.use(express.json());

    // CREATE a GrapgQL Server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => "hello there",
                say: (_, { name }: { name: String }) => `Hey welcome ${name}`,
            },
            Mutation: {
                createUser: async (
                    _,
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
                ): Promise<Boolean> => {
                    await prismaClient.user.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            password,
                            salt: "random_salt",
                        },
                    });
                    return true;
                },
            },
        },
    });

    // Start GrapgQL Server
    await gqlServer.start();

    app.get("/api/", (req, res) => {
        return res.status(200).json({
            message: "Server is up!",
            success: true,
        });
    });

    // APIs to GQL Server
    app.use("/graphql/api", expressMiddleware(gqlServer));

    app.listen(PORT, () => {
        console.log(`listening on port --> http://localhost:${PORT}/api`);
    });
}
init();
