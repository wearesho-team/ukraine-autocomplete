import * as http from "http";
import * as unzip from "unzip";
import * as parse from "csv-parse";
import * as entity from "./entity";
import * as data from "./data";
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

    await createConnection();

    parser.on("readable", async () => {
        let record: [ string, string | undefined, string, number, string, string ];

        // noinspection JSAssignmentUsedAsCondition
        while (record = parser.read()) {
            let [ regionName, districtName, townData, , streetData, housesNumbers ] = record;

            if (regionName === "Область") {
                continue;
            }

            if (!region || region.name !== regionName) {
                region = await entity.Region.findOne({ where: { name: regionName, } });

                if (!region) {
                    region = new entity.Region;
                    region.name = regionName;
                    await region.save();

                    regions++;
                }

                console.log(`Region ${region.name}`);
            }

            const townMatch = townData.match(/^([а-яА-Яїі’"\-]+)\.?\s(.+)$/);
            if (!townMatch) {
                console.error(`Error processing town.`);
                console.error(record);
                process.exit(-1);
            }
            let [ , townType, townName, ] = townMatch;
            if (!districtName) {
                districtName = townName;
            }

            switch (townType) {
                case 'м':
                    townType = data.TownType.town;
                    break;
                case 'с':
                case 'с-ще':
                    townType = data.TownType.hamlet;
                    break;
                case 'смт':
                    townType = data.TownType.village;
                    break;
                default:
                    console.error(`Unsupported town type`, townType, record);
                    process.exit(-3);
            }

            if (!district || district.region_id !== region.id || district.name !== districtName) {
                const where = {
                    region_id: region.id,
                    name: districtName,
                };
                district = await entity.District.findOne({ where, });

                if (!district) {

                    district = new entity.District;
                    Object.assign(district, where);
                    await district.save();
                    districts++;
                }

                console.log(`\tDistrict ${districtName} (${((new Date).getTime() - begin) / 1000})`);
            }

            if (!town || town.district_id !== district.id || town.type !== townType || town.name !== townName) {
                const where = {
                    district_id: district.id,
                    type: townType,
                    name: townName,
                };
                town = await entity.Town.findOne({ where, });

                if (!town) {
                    town = new entity.Town;
                    Object.assign(town, where);
                    await town.save();
                    towns++;
                }
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
                const where = {
                    town_id: town.id,
                    type: streetType,
                    name: streetName,
                };
                street = await entity.Street.findOne({ where, });

                if (!street) {
                    street = new entity.Street;
                    Object.assign(street, where);
                    await street.save();

                    streets++;
                }
            }

            let streetHouseNumbers: Array<number> = (await entity.House.createQueryBuilder()
                .andWhere('street_id = :streetId', { streetId: street.id, })
                .select('number')
                .getRawMany())
                .map(({ number }) => Number(number));

            const promises = housesNumbers.split(",")
                .filter((houseNumber: string) => !!houseNumber)
                .map((houseNumber: string) => Number(houseNumber))
                .filter((houseNumber) => streetHouseNumbers.includes(houseNumber))
                .map(async (houseNumber: number) => {
                    const house = new entity.House;
                    house.street_id = street.id;
                    house.number = houseNumber;

                    await house.save();

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
