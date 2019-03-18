import { Request, Response } from "express";
import * as entity from "../entity";
import * as data from "../data";

export const District = async (request: Request, response: Response) => {
    const query = entity.District.createQueryBuilder("District");

    if ("string" === typeof request.query[ "q" ]) {
        query.andWhere("District.name like :name", { name: `%${request.query[ data.Query.name ]}%` });
    }

    const regionId = request.header(data.Header.RegionId);
    if ("string" === typeof regionId && regionId.match(/^\d+$/)) {
        query.andWhere(
            "District.region_id = :regionId",
            { regionId, }
        );
    }

    const regionName = request.header(data.Header.RegionName);
    if ("string" === typeof regionName) {
        query
            .leftJoinAndSelect("District.region", "Region")
            .andWhere('Region.name like :regionName', { regionName: `%${decodeURIComponent(regionName)}%` })
    }

    query.limit(25);

    const districts = await query.getMany();

    response.json(districts);
};
