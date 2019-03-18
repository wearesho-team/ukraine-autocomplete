import { Request, Response } from "express";
import * as entity from "../entity";
import * as data from "../data";

export const Town = async (request: Request, response: Response) => {
    const query = entity.Town.createQueryBuilder("Town");

    const name = request.query[ data.Query.name ];
    if ("string" === typeof name) {
        query.andWhere("lower(Town.name) like :name", { name: `%${name.toLowerCase()}%` });
    }

    const type = request.query[ data.Query.type ];
    if ("string" === typeof type && Object.values(data.TownType).includes(type)) {
        query.andWhere("Town.type = :type", { type, });
    }

    const districtId = request.header(data.Header.DistrictId);
    if ("string" === typeof districtId && districtId.match(/^\d+$/)) {
        query.andWhere('Town.district_id = :districtId', { districtId, });
    }

    let districtName = request.header(data.Header.DistrictName);
    const regionId = request.header(data.Header.RegionId);
    let regionName = request.header(data.Header.RegionName);
    if (districtName || regionId || regionName) {
        query.innerJoinAndSelect("Town.district", "District")
    }

    if ("string" === typeof districtName) {
        districtName = `%${decodeURIComponent(districtName).toLowerCase()}%`;
        query
            .andWhere(
                "lower(District.name) like :districtName",
                { districtName, }
            );
    }

    if ("string" === typeof regionId && regionId.match(/^\d+$/)) {
        query
            .andWhere(
                "District.region_id = :regionId",
                { regionId, }
            );
    }

    if ("string" === typeof regionName) {
        regionName = `%${decodeURIComponent(regionName).toLowerCase()}%`;
        query
            .innerJoinAndSelect("District.region", "Region")
            .andWhere('lower(Region.name) like :regionName', { regionName, })
    }

    query.limit(25);

    const towns = await query.getMany();

    response.json(towns);
};
