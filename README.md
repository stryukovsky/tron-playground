# Tron simple indexer of ERC20 transfers

This indexers reads ERC20 token transfers and writes them to database using Prisma ORM

## Start
Clone this repo for start and execute command:
```
yarn
```

Provide envs in `.env` file according `.env.example` template and then start
In `.env.example` there are already envs to start: indexing mainnet Tether USD coin transfers
```
ts-node src/main.ts
