# Wearesho Autocomplete
This project uses [Ukrposhta](https://ukrposhta.ua/dovidnik-poshtovix-adre/opis/) database 
to generate database and provides simple API for searching addresses.

## Setup
1. Run `npm i` command
2. Setup database settings using environment (copy [.env.example](./.env.example) to `.env`)
3. Run migrations `npm run migrate`
4. Import database `npm run import` (execution time <5 min)
3. Run `npm start` command

## License
[Apache-2.0](./LICENSE)
