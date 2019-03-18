import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class RegionCreate1552913442685 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "region",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "18",
                    isNullable: false,
                    isUnique: true,
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("region");
    }
}
