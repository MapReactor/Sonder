# Project Name

> Sonder Server

## Team

  - __Product Owner__: George Michel
  - __Scrum Master__: Matt Walsh
  - __Development Team Members__: Aaron Trank, Paige Vogenthaler

## Usage

1 Install Docker
2 Create Redis Docker Container
3 Create Postgres Docker Container
4 Configure host and port for Redis in server/redis/config.js
5 Configure host and port for Postgres in server/db/config.js
6 From server folder run: npm run db:create
7 From server foler run: npm start

### To drop database
From server folder run: npm run db:drop

### To drop then create database (for convenience)
From server folder run: npm run reset
