import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateDistrict1552914206514 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "district",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                },
                {
                    name: "region_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false,
                }
            ]
        }));

        await queryRunner.createForeignKey("district", new TableForeignKey({
            name: "fk_district_region",
            columnNames: [ "region_id" ],
            referencedTableName: "region",
            referencedColumnNames: [ "id" ],
            onUpdate: "cascade",
            onDelete: "cascade",
        }));

        await queryRunner.createIndex("district", new TableIndex({
            name: "UNQ_REGION_DISTRICT",
            columnNames: [ "region_id", "name", ],
            isUnique: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("district");
    }
}
