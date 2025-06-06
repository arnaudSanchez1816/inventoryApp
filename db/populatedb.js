#! /usr/bin/env node

require("dotenv").config()
const { Client } = require("pg")

const SQL = `
CREATE TABLE IF NOT EXISTS constructors (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ),
  country VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS models (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ),
  year SMALLINT,
  constructor_id INTEGER,
  CONSTRAINT fk_constructor FOREIGN KEY (constructor_id) REFERENCES constructors(id)
);

CREATE TABLE IF NOT EXISTS trims (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ),
  model_id INTEGER,
  CONSTRAINT fk_model FOREIGN KEY (model_id) REFERENCES models(id)
);

CREATE TABLE IF NOT EXISTS powertrains (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ),
  type VARCHAR(255),
  engine_code VARCHAR(255),
  displacement FLOAT,
  power INTEGER,
  torque INTEGER,
  engine_layout VARCHAR(255),
  transmission VARCHAR(255),
  drivetrain VARCHAR(255),
  model_id INTEGER,
  CONSTRAINT fk_model FOREIGN KEY (model_id) REFERENCES models(id)
);

CREATE TABLE IF NOT EXISTS trim_powertrain_compatibilities (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  trim_id INTEGER,
  powertrain_id INTEGER,
  CONSTRAINT fk_trim FOREIGN KEY (trim_id) REFERENCES trims(id),
  CONSTRAINT fk_powertrain FOREIGN KEY (powertrain_id) REFERENCES powertrains(id)
);

CREATE TABLE IF NOT EXISTS cars (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  price DECIMAL(9),
  model_id INTEGER,
  trim_id INTEGER,
  powertrain_id INTEGER,
  CONSTRAINT fk_model FOREIGN KEY (model_id) REFERENCES models(id),
  CONSTRAINT fk_trim FOREIGN KEY (trim_id) REFERENCES trims(id),
  CONSTRAINT fk_powertrain FOREIGN KEY (powertrain_id) REFERENCES powertrains(id)
);

CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  stock INTEGER,
  car_id INTEGER,
  CONSTRAINT kf_car FOREIGN KEY (car_id) REFERENCES cars(id)
);

INSERT INTO constructors (name, country) 
VALUES
  ('Ferrari', 'Italy'),
  ('BMW', 'Germany'),
  ('Renault', 'France');

INSERT INTO models (name, year, constructor_id) 
VALUES
  ('Enzo', 2002, 1),
  ('5 Series (G60)', 2024, 2),
  ('Clio V', 2019, 3);

INSERT INTO trims (name, model_id) 
VALUES
  ('', 1),
  ('', 2),
  ('M Sport', 2),
  ('génération', 3),
  ('evolution', 3),
  ('techno', 3),
  ('esprit alpine', 3);

INSERT INTO powertrains (name, type, engine_code, displacement, power, torque, engine_layout, transmission, drivetrain, model_id) 
VALUES
  ('Tipo F140B', 'Petrol', 'F140B', 5998.80, 660, 657, 'V12', '6-speed automated manual', 'RWD', 1),
  ('520i', 'Petrol', 'B48', 1998, 208, 330, 'Inline-four', '8-speed automatic', 'RWD', 2),
  ('520d', 'Diesel', 'B47', 1995, 197, 400, 'Inline-four', '8-speed automatic', 'RWD', 2),
  ('530e', 'Petrol Hybrid', 'B48', 1998, 299, 450, 'Inline-four', '8-speed automatic', 'AWD', 2),
  ('1.0 SCe', 'Petrol', 'B4D', 999, 67, 95, 'Inline-three', '5-speed manual', 'FWD', 3),
  ('1.0 TCe', 'Petrol', 'H4D', 999, 91, 160, 'Inline-three', '6-speed manual', 'FWD', 3),
  ('1.5 Blue dCi', 'Diesel', 'K9K', 1461, 101, 260, 'Inline-four', '6-speed manual', 'FWD', 3);

INSERT INTO trim_powertrain_compatibilities (trim_id, powertrain_id) 
VALUES
  (1, 1),
  (2, 2),
  (2, 3),
  (2, 4),
  (3, 2),
  (3, 3),
  (3, 4),
  (4, 5),
  (4, 6),
  (4, 7),
  (5, 5),
  (5, 6),
  (5, 7),
  (6, 6),
  (7, 6);

INSERT INTO cars (price, model_id, trim_id, powertrain_id) 
VALUES
  (675000, 1, 1, 1),
  (64350, 2, 2, 2),
  (68700, 2, 3, 2),
  (66650, 2, 2, 3),
  (71000, 2, 3, 3),
  (73150, 2, 2, 4),
  (77500, 2, 3, 4),
  (16900, 3, 4, 5),
  (18500, 3, 4, 6),
  (19900, 3, 4, 7),
  (19600, 3, 5, 5),
  (21200, 3, 5, 6),
  (22900, 3, 5, 7),
  (22200, 3, 6, 6),
  (25000, 3, 7, 6);

INSERT INTO inventory (stock, car_id) 
VALUES
  (1, 1),
  (10, 2),
  (8, 3),
  (6, 4),
  (23, 9),
  (16, 11);
`

async function main() {
    const client = new Client()

    try {
        console.log("seeding...")
        await client.connect()
        await client.query(SQL)
    } catch (error) {
        console.error(error)
    } finally {
        await client.end()
        console.log("done")
    }
}

main()
