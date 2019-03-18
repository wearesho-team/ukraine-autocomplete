import { NextFunction, Request, Response } from "express";
import * as action from "./action";

export const Routes: Array<{
    path: string,
    action: (request: Request, response: Response, next: NextFunction) => Promise<void>
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
        path: "/town/:id/streets",
        action: action.Street,
    },
    {
        path: "/street/:id/houses",
        action: action.House,
    },
    {
        path: "/",
        action: action.Home,
    },
    {
        path: "*",
        action: action.Error(404, "Not Found"),
    }
];
