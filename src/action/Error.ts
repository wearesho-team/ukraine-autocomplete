import { Request, Response } from "express";

export const Error = (statusCode: number, message?: string) =>
    async (request: Request, response: Response) => {
        response.status(statusCode).json({
            code: statusCode,
            message: message || "Unknown Error",
        });
    };
