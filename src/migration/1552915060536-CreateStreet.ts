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
                    isGenerated: true,
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
            name: "FK_STREET_TOWN",
            columnNames: [ "town_id", ],
            referencedTableName: "town",
            referencedColumnNames: [ "id", ],
            onUpdate: "cascade",
            onDelete: "cascade",
        }));

        await queryRunner.createIndex("street", new TableIndex({
            name: "UNQ_TOWN_STREET",
            columnNames: [ "town_id", "type", "name", ],
            isUnique: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("street");
    }
}
