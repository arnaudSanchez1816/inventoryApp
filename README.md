# Auto Inventory

Small auto inventory application made using Node (Express) and a Postgres database.\
Front end is rendered server-side using EJS as template engine.\
Tailwind is used for CSS styling.

![Auto Inventory preview](./docs/preview.png?raw=true)_Preview from the website_

Feature the ability to enter data for car models and car manufacturers.

Each car model contains a list of trims available to purchase and a list of powertrain options.\
Each powertrain option is compatible to an arbitrary combination of trims.

The car inventory is represented as a list of car configurations.\
A configuration is combination of a trim and powertrain, a price and an available stock.

Made as part of the [Odin Project](https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application) NodeJS course.
