import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as cors from "cors";
import * as action from "./action";
import * as data from "./data";
import { Routes } from "./routes";
import { NextFunction, Request, Response } from "express";

createConnection().then(async connection => {
    // create express app
    const app = express();
    app.use(cors());

    // register express routes from defined application routes
    Routes.forEach(route => {
        app.get(route.path,
            (request: Request, response: Response, next: NextFunction) =>
                route.action(request, response, next).catch((error) => {

                    // Log only important headers
                    const headers = {};
                    Object.values(data.Header)
                        .filter((header) => !!request.headers[ header.toLowerCase() ])
                        .forEach((header) => headers[ header ] = request.headers[ header.toLowerCase() ]);

                    console.error(`GET ${request.path}`, headers, error);
                    action.Error(500, "Internal Server Error")(request, response);
                })
        );
    });

    // start express server
    app.listen(3000);

    console.log("Express server has started on port 3000. Open http://localhost:3000/ to see results");

}).catch(error => console.error(error));
