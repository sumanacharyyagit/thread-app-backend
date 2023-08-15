import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import apoloGraphQlServer from "./graphql";
import UserService from "./services/user";

async function init() {
    const app = express();

    const PORT = Number(process.env.PORT) || 8080;

    app.use(express.json());

    app.get("/api/", (req, res) => {
        return res.status(200).json({
            message: "Server is up!",
            success: true,
        });
    });

    const gqlServer = await apoloGraphQlServer();

    // APIs to GQL Server
    app.use(
        "/graphql/api",
        expressMiddleware(gqlServer, {
            context: async ({ req }: any) => {
                const token = req.headers["token"];
                try {
                    const user = await UserService.userDecodeJWTToken(
                        token as string
                    );
                    return { user };
                } catch (error) {
                    return {};
                }
            },
        })
    );

    app.listen(PORT, () => {
        console.log(`listening on port --> http://localhost:${PORT}/api`);
    });
}
init();
