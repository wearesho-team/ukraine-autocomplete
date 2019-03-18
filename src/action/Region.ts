import { Request, Response } from "express";
import * as entity from "../entity";
import * as data from "../data";

export const Region = async (request: Request, response: Response) => {
    const query = entity.Region.createQueryBuilder();

    const name = request.query[ data.Query.name ];
    if ("string" === typeof name) {
        query.andWhere("lower(name) like :name", { name: `%${name.toLowerCase()}%` });
    }

    const regions = await query.getMany();

    response.json(regions);
};
