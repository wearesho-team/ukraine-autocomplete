import { NextFunction, Request, Response } from "express";
import * as action from "./action";

export const Routes: Array<{
    path: string,
    action: (request: Request, response: Response, next: NextFunction) => void
}> = [
    {
        path: "/regions",
        action: action.Region,
    },
    {
        path: "/districts",
        action: action.District,
    },
    {
        path: "/towns",
        action: action.Town,
    },
    {
        path: "/",
        action: action.Home,
    }
];
