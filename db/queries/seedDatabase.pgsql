CREATE TABLE IF NOT EXISTS constructors (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ),
  country VARCHAR ( 255 ),
  logo_path VARCHAR( 255)
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
  trim_id INTEGER,
  powertrain_id INTEGER,
  PRIMARY KEY (trim_id, powertrain_id),
  CONSTRAINT fk_trim FOREIGN KEY (trim_id) REFERENCES trims(id) ON DELETE CASCADE,
  CONSTRAINT fk_powertrain FOREIGN KEY (powertrain_id) REFERENCES powertrains(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cars (
  price DECIMAL(9),
  model_id INTEGER,
  trim_id INTEGER,
  powertrain_id INTEGER,
  PRIMARY KEY (model_id, trim_id, powertrain_id),
  CONSTRAINT fk_model FOREIGN KEY (model_id) REFERENCES models(id),
  CONSTRAINT fk_trim FOREIGN KEY (trim_id) REFERENCES trims(id),
  CONSTRAINT fk_powertrain FOREIGN KEY (powertrain_id) REFERENCES powertrains(id)
);

CREATE TABLE IF NOT EXISTS inventory (
  stock INTEGER,
  model_id INTEGER,
  trim_id INTEGER,
  powertrain_id INTEGER,
  PRIMARY KEY (model_id, trim_id, powertrain_id),
  CONSTRAINT fk_car FOREIGN KEY (model_id, trim_id, powertrain_id) REFERENCES cars(model_id, trim_id, powertrain_id)
);

INSERT INTO constructors (name, country, logo_path) 
VALUES
  ('Ferrari', 'Italy', '1.svg'),
  ('BMW', 'Germany', '2.svg'),
  ('Renault', 'France', '3.svg');

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

INSERT INTO inventory (stock, model_id, trim_id, powertrain_id) 
VALUES
  (2, 1, 1, 1),
  (20, 2, 2, 2),
  (14, 2, 3, 2),
  (24, 2, 2, 3),
  (17, 2, 3, 3),
  (21, 2, 2, 4),
  (11, 2, 3, 4),
  (240, 3, 4, 5),
  (198, 3, 4, 6),
  (174, 3, 4, 7),
  (195, 3, 5, 5),
  (164, 3, 5, 6),
  (139, 3, 5, 7),
  (157, 3, 6, 6),
  (151, 3, 7, 6);

CREATE PROCEDURE insert_powertrain(
    in_name text,
    in_type text,
    in_engine_code text,
    in_displacement float,
    in_power integer,
    in_torque integer,
    in_engine_layout text,
    in_transmission text,
    in_drivetrain text,
    in_model_id integer,
    in_trim_ids integer[]
)
LANGUAGE plpgsql AS $$
DECLARE
    powertrain_id integer;
    trim_id integer;
BEGIN 
    INSERT INTO powertrains (name, type, engine_code, displacement, power, torque, engine_layout, transmission, drivetrain, model_id) 
    VALUES
    (in_name, in_type, in_engine_code, in_displacement, in_power, in_torque, in_engine_layout, in_transmission, in_drivetrain, in_model_id) RETURNING id INTO powertrain_id;

    FOREACH trim_id IN ARRAY in_trim_ids loop
    INSERT INTO trim_powertrain_compatibilities (trim_id, powertrain_id) VALUES (trim_id, powertrain_id);
    end loop;
END;
$$;

CREATE OR REPLACE PROCEDURE update_powertrain(
    in_id integer,
    in_name text,
    in_type text,
    in_engine_code text,
    in_displacement float,
    in_power integer,
    in_torque integer,
    in_engine_layout text,
    in_transmission text,
    in_drivetrain text,
    in_trim_ids integer[]
)
LANGUAGE plpgsql AS $$
DECLARE
    trim_id integer;
BEGIN 
    UPDATE powertrains
        SET name=in_name, engine_code=in_engine_code, type=in_type, displacement=in_displacement,
        power=in_power, torque=in_torque, engine_layout=in_engine_layout, transmission=in_transmission, drivetrain=in_drivetrain
    WHERE id=in_id;

    DELETE FROM trim_powertrain_compatibilities WHERE powertrain_id=in_id;

    FOREACH trim_id IN ARRAY in_trim_ids loop
    INSERT INTO trim_powertrain_compatibilities (trim_id, powertrain_id) VALUES (trim_id, in_id);
    END loop;
END;
$$;