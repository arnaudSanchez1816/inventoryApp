SELECT
    c.model_id,
    c.trim_id,
    c.powertrain_id,
    (powertrains.name || ' ' || trims.display_name) AS name,
    c.price,
    c.stock,
    to_jsonb(trims) AS trim,
    to_jsonb(powertrains) AS powertrain
FROM
    configurations AS c
    JOIN trims ON trims.id = c.trim_id
    JOIN powertrains ON powertrains.id = c.powertrain_id
WHERE
    c.model_id = $1
GROUP BY
    c.model_id,
    c.trim_id,
    c.powertrain_id,
    c.price,
    c.stock,
    trims.id,
    powertrains.id;