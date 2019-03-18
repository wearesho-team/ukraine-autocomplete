import { NextFunction, Request, Response } from "express";
import * as entity from "../entity";
import * as data from "../data";

export const Street = async (request: Request, response: Response, next: NextFunction) => {
    const townId = request.params[ "id" ];
    if ("string" !== typeof townId || !townId.match(/^\d+$/)) {
        return next();
    }

    const query = entity.Street.createQueryBuilder();
    query.andWhere("town_id = :townId", { townId, });

    const name = request.query[ data.Query.name ];
    if ("string" === typeof name) {
        query.andWhere("lower(name) like :name", { name: `%${name.toLowerCase()}%` });
    }

    const type = request.query[ data.Query.type ];
    if ("string" === typeof type) {
        query.andWhere("lower(type) = :type", { type: type.toLowerCase(), });
    }

    query.limit(25);

    const regions = await query.getMany();

    response.json(regions);
};
