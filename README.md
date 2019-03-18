# Wearesho Autocomplete

- Using [Ukrposhta](https://ukrposhta.ua/dovidnik-poshtovix-adre/opis/) addresses database
- Provides simple API for searching addresses
(main purpose - registration forms autocomplete).
- Supports PostgreSQL and MySQL out-of-box.
- Written on TypeScript

[Blueprint API](./apiary.apib) | [Apiary](https://ukraineautocomplete.docs.apiary.io/)

## Setup
1. Run `npm i` command
2. Setup database settings using environment (copy [.env.example](./.env.example) to `.env`)
3. Run migrations `npm run migrate`
4. Import database `npm run import` (execution time <10 min)
3. Run `npm start` command

## Docker
Build:
```bash
 docker build -t ukraine-autocomplete -f ./docker/Dockerfile .
```
Run:
```bash
docker run -p 3000:3000 -v /folder/.env:/usr/src/app/.env ukraine-autocomplete
```

## License
[Apache-2.0](./LICENSE)
