WITH get_model AS (
    SELECT m.id, 
    m.name, 
    m.year,
    m.constructor_id
    FROM models AS m
    WHERE m.id = $1
),
get_powertrains_trims AS (
    SELECT powertrains.*, array_agg(trims.id) as compatible_trims
    FROM powertrains
    JOIN trim_powertrain_compatibilities on trim_powertrain_compatibilities.powertrain_id = powertrains.id
    JOIN trims on trims.id = trim_powertrain_compatibilities.trim_id
    JOIN get_model AS model_details ON model_details.id = powertrains.model_id
    GROUP BY powertrains.id
    ORDER BY powertrains.name
),
aggregate_powertrains AS (
    SELECT get_model.*, array_agg(get_powertrains_trims) powertrains
    FROM get_model
    JOIN get_powertrains_trims ON get_model.id = get_powertrains_trims.model_id
    GROUP BY get_model.id, get_model.name, get_model.year, get_model.constructor_id
),
get_trims AS (
    SELECT m.id, m.name, m.year, m.constructor_id, m.powertrains, array_agg(t) trims
    FROM aggregate_powertrains as m
    JOIN trims AS t ON m.id = t.model_id
    GROUP BY m.id, m.name, m.year, m.constructor_id, m.powertrains
),
get_constructor AS (
    SELECT m.id, m.name, m.year, to_jsonb(c) constructor, m.powertrains, m.trims
    FROM get_trims as m
    JOIN constructors AS c ON m.constructor_id = c.id
)
SELECT row_to_json(get_constructor) as results FROM get_constructor