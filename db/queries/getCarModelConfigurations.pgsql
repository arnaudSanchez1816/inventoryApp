SELECT
    c.model_id,
    c.trim_id,
    c.powertrain_id,
    (powertrains.name || ' ' || trims.name) AS name,
    c.price,
    i.stock,
    to_jsonb(trims) AS trim,
    to_jsonb(powertrains) AS powertrain
FROM
    cars AS c
    JOIN trims ON trims.id = c.trim_id
    JOIN powertrains ON powertrains.id = c.powertrain_id
    JOIN inventory AS i ON c.model_id = i.model_id
    AND c.trim_id = i.trim_id
    AND c.powertrain_id = i.powertrain_id
WHERE
    c.model_id = $1
GROUP BY
    c.model_id,
    c.trim_id,
    c.powertrain_id,
    c.price,
    i.stock,
    trims.id,
    powertrains.id;