import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateTown1552914490822 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "town",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                },
                {
                    name: "district_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "type",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false,
                }
            ]
        }));

        await queryRunner.createForeignKey("town", new TableForeignKey({
            name: "fk_town_district",
            columnNames: [ "district_id", ],
            referencedTableName: "district",
            referencedColumnNames: [ "id", ],
            onUpdate: "cascade",
            onDelete: "cascade",
        }));

        await queryRunner.createIndex("town", new TableIndex({
            name: "unique_district_town",
            columnNames: [ "district_id", "name", ],
            isUnique: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("town");
    }
}
