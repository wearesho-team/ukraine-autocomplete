import { NextFunction, Request, Response } from "express";
import * as entity from "../entity";
import * as data from "../data";

export const House = async (request: Request, response: Response, next: NextFunction) => {
    const streetId = request.params[ "id" ];
    if ("string" !== typeof streetId || !streetId.match(/^\d+$/)) {
        return next();
    }

    const query = entity.House.createQueryBuilder();
    query.andWhere("House.street_id = :streetId", { streetId, });

    const number = request.query[ data.Query.name ];
    if ("string" === typeof number) {
        query.andWhere(
            "lower(number) like :number",
            { number: `%${number.toLowerCase()}%` }
        );
    }

    query.limit(25);

    console.log(query.getSql());

    const regions = await query.getMany();

    response.json(regions);
};
