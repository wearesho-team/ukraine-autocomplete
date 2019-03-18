import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateStreet1552915060536 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "street",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                },
                {
                    name: "town_id",
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


        await queryRunner.createForeignKey("street", new TableForeignKey({
            name: "fk_street_town",
            columnNames: [ "town_id", ],
            referencedTableName: "town",
            referencedColumnNames: [ "id", ],
            onUpdate: "cascade",
            onDelete: "cascade",
        }));

        await queryRunner.createIndex("street", new TableIndex({
            name: "unique_town_street",
            columnNames: [ "town_id", "type", "name", ],
            isUnique: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("street");
    }
}
