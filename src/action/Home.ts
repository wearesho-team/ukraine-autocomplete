import { Request, Response } from "express";
import * as meta from "../../meta";
import * as data from "../data";

export const Home = async (request: Request, response: Response) => {
    const origin = request.get("Origin")
        ? `${request.get("Origin")}`
        : "";

    response.json({
        name: meta.name,
        version: meta.version,
        routes: [
            {
                name: "Home",
                path: `${origin}/`,
                description: "Application information.",
            },
            {
                name: "Regions",
                path: `${origin}/regions`,
                description: "Searching regions.",
                query: {
                    [ data.Query.name ]: "Partial of region name."
                },
            },
            {
                name: "Districts",
                path: `${origin}/districts`,
                description: "Searching districts.",
                query: {
                    [ data.Query.name ]: "Partial of district name.",
                },
                headers: {
                    [ data.Header.RegionId ]: "Exact region ID.",
                    [ data.Header.RegionName ]: "URL Encoded partial of region name.",
                },
            },
            {
                name: "Towns",
                path: `${origin}/towns`,
                description: "Searching towns.",
                query: {
                    [ data.Query.name ]: "Partial of town name.",
                    [ data.Query.type ]: "Exact town type",
                },
                headers: {
                    [ data.Header.RegionId ]: "Exact region ID.",
                    [ data.Header.RegionName ]: "URL Encoded partial of region name.",
                    [ data.Header.DistrictId ]: "Exact district ID.",
                    [ data.Header.DistrictName ]: "URL Encoded partial of district name.",
                },
            },
            {
                name: "Streets",
                path: `${origin}/town/:id/streets`,
                description: "Searching town streets.",
                query: {
                    [ data.Query.name ]: "Partial of street name.",
                    [ data.Query.type ]: "Exact street type",
                },
            },
            {
                name: "Houses",
                path: `${origin}/street/:id/houses`,
                description: "Searching street houses.",
                query: {
                    [ data.Query.name ]: "Partial of house number.",
                },
            },
        ],
        links: {
            gitHub: "https://github.com/wearesho-team/wearesho-autocomplete",
        },
    })
};
