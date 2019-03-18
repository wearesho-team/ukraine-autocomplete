import { Request, Response } from "express";
import * as entity from "../entity";
import * as data from "../data";

export const Region = async (request: Request, response: Response) => {
    const query = entity.Region.createQueryBuilder();

    const name = request.query(data.Query.name);
    if ("string" === name) {
        query.andWhere("name like :name", { name: `%${name}%` });
    }

    query.limit(25);

    const regions = await query.getMany();

    response.json(regions);
};
