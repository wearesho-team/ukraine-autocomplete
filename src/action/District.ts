import { Request, Response } from "express";
import * as entity from "../entity";
import * as data from "../data";

export const District = async (request: Request, response: Response) => {
    const query = entity.District.createQueryBuilder("District");

    const name = request.query[ data.Query.name ];
    if ("string" === name) {
        query.andWhere("lower(District.name) like :name", { name: `%${name.toLowerCase()}%` });
    }

    const regionId = request.header(data.Header.RegionId);
    if ("string" === typeof regionId && regionId.match(/^\d+$/)) {
        query.andWhere(
            "District.region_id = :regionId",
            { regionId, }
        );
    }

    let regionName = request.header(data.Header.RegionName);
    if ("string" === typeof regionName) {
        regionName = `%${decodeURIComponent(regionName).toLowerCase()}%`;
        query
            .innerJoinAndSelect("District.region", "Region")
            .andWhere('lower(Region.name) like :regionName', { regionName, })
    }

    query.limit(25);

    const districts = await query.getMany();

    response.json(districts);
};
