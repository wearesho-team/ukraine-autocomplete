import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { Routes } from "./routes";

createConnection().then(async connection => {
    // create express app
    const app = express();

    // register express routes from defined application routes
    Routes.forEach(route => {
        app.get(route.path, route.action);
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    console.log("Express server has started on port 3000. Open http://localhost:3000/ to see results");

}).catch(error => console.log(error));
