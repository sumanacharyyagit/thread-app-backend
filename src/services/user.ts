import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "TheUltimate@secret123";

export interface ICreateUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}

export interface IGetUserTokenPayload {
    email: string;
    password: string;
}

class UserService {
    private static generateHash(salt: string, password: string) {
        return createHmac("sha256", salt).update(password).digest("hex");
    }

    public static async getUserById(id: string) {
        return await prismaClient.user.findUnique({ where: { id } });
    }

    public static createUser(payload: ICreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = this.generateHash(salt, password);

        return prismaClient.user.create({
            data: {
                firstName,
                lastName: lastName || "",
                email,
                salt,
                password: hashedPassword,
            },
        });
    }

    private static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email } });
    }

    public static async getUserToken(payload: IGetUserTokenPayload) {
        const { email, password } = payload;
        const user = await this.getUserByEmail(email);
        if (!user) throw new Error("User not exist.");

        const userSalt = user.salt;
        const userHashedPass = this.generateHash(userSalt, password);
        if (userHashedPass !== user.password)
            throw new Error("Incorrect password!");

        // Generate a token
        const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        return token;
    }

    public static async userDecodeJWTToken(token: string) {
        return JWT.verify(token, JWT_SECRET);
    }
}

export default UserService;
