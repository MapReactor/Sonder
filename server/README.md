# Project Name

> Sonder Server

## Team

  - __Product Owner__: George Michel
  - __Scrum Master__: Matt Walsh
  - __Development Team Members__: Aaron Trank, Paige Vogenthaler

## Usage

> Install Docker
> Create Redis Docker Container
> Create Postgres Docker Container
> Configure host and port for Redis in server/redis/config.js
> Configure host and port for Postgres in server/db/config.js
> From server folder run: npm run db:create
> From server foler run: npm start

To drop database
> From server folder run: npm run db:drop

To drop then create database (for convenience)
> From server folder run: npm run reset
