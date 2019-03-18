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
                    isGenerated: true,
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
            name: "FK_TOWN_DISTRICT",
            columnNames: [ "district_id", ],
            referencedTableName: "district",
            referencedColumnNames: [ "id", ],
            onUpdate: "cascade",
            onDelete: "cascade",
        }));

        await queryRunner.createIndex("town", new TableIndex({
            name: "UNQ_DISTRICT_TOWN",
            columnNames: [ "district_id", "name", "type", ],
            isUnique: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("town");
    }
}
