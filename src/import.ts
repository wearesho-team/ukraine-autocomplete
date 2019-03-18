import * as http from "http";
import * as unzip from "unzip";
import * as parse from "csv-parse";
import * as entity from "./entity";
import { Iconv } from "iconv";
import { createConnection } from "typeorm";

const postIndexHousesUrl = `http://services.ukrposhta.com/postindex_new/upload/houses.zip`;
const parser = async function () {
    let region: entity.Region | undefined;
    let district: entity.District | undefined;
    let town: entity.Town | undefined;
    let street: entity.Street | undefined;

    const begin = (new Date).getTime();
    let regions = 0;
    let districts = 0;
    let towns = 0;
    let streets = 0;
    let houses = 0;

    const parser = parse({
        delimiter: ';',
        quote: false,
        trim: true,
    });

    const connection = await createConnection();
    const { affected } = await connection.createQueryBuilder<entity.Region>(entity.Region, "Region")
        .delete()
        .execute();

    console.log(`Removed ${affected} regions.`);

    parser.on("readable", async () => {
        let record: [ string, string | undefined, string, number, string, string ];

        // noinspection JSAssignmentUsedAsCondition
        while (record = parser.read()) {
            let [ regionName, districtName, townData, , streetData, housesNumbers ] = record;

            if (regionName === "Область") {
                continue;
            }

            if (!region || region.name !== regionName) {
                region = new entity.Region;
                region.name = regionName;
                await region.save();

                regions++;
                console.log(`Region ${region.name}`);
            }

            const townMatch = townData.match(/^([а-яА-Яїі’"\-]+)\.?\s(.+)$/);
            if (!townMatch) {
                console.error(`Error processing town.`);
                console.error(record);
                process.exit(-1);
            }
            const [ , townType, townName, ] = townMatch;
            if (!districtName) {
                districtName = townName;
            }

            if (!district || district.region_id !== region.id || district.name !== districtName) {
                district = new entity.District;
                district.region_id = region.id;
                district.name = districtName;
                await district.save();

                districts++;
                console.log(`\tDistrict ${districtName} (${((new Date).getTime() - begin) / 1000})`);
            }

            if (!town || town.district_id !== district.id || town.type !== townType || town.name !== townName) {
                town = new entity.Town;
                town.district_id = district.id;
                town.type = townType;
                town.name = townName;
                await town.save();

                towns++;
            }

            if (!streetData) {
                continue;
            }

            const streetMatch = streetData.match(/^([а-яА-Яїі\-’"]+)\.?\s(.+)$/);
            if (!streetMatch) {
                console.error(`Error processing street.`);
                console.error(record);
                process.exit(-2);
            }
            const [ , streetType, streetName, ] = streetMatch;
            if (!street || street.town_id !== town.id || street.type !== streetType || street.name !== streetName) {
                street = new entity.Street;
                street.town_id = town.id;
                street.type = streetType;
                street.name = streetName;
                await street.save();

                streets++;
            }

            const promises = housesNumbers.split(",")
                .filter((houseNumber: string) => !!houseNumber)
                .map((houseNumber: string) => Number(houseNumber))
                .map(async (houseNumber: number) => {
                    const house = new entity.House;
                    house.street_id = street.id;
                    house.number = houseNumber;

                    await house.save().catch(() => houses--);

                    houses++;

                    return houseNumber;
                });

            await Promise.all(promises);
        }
    });

    parser.on("error", (error: Error) => {
        console.error(error);
    });

    parser.on("end", () => {
        console.log(`Done (${((new Date).getTime() - begin) / 1000})`);
        console.log(`\tRegions: ${regions}`);
        console.log(`\tDistricts ${districts}`);
        console.log(`\tTowns ${towns}`);
        console.log(`\tHouses ${houses}`);
    });

    return parser;
};

http.get(postIndexHousesUrl, (response) => {
    response
        .pipe(unzip.Parse())
        .on("entry", async (entry: unzip.Entry) => {
            if (entry.path === "houses.csv") {
                console.log(`Found houses.csv`);
                const iconv = new Iconv("CP1251", "UTF-8");
                parser().then(parse => entry.pipe(iconv).pipe(parse));
            } else {
                entry.autodrain();
            }
        });
});
