WITH get_constructor_details AS (
    SELECT constructors.id, constructors.name, constructors.country, constructors.logo_path, json_agg(models) as models
    FROM constructors 
    JOIN models ON constructors.id = models.constructor_id
    WHERE constructors.id = $1
    GROUP BY constructors.id
    ORDER BY constructors.id
)
SELECT row_to_json(get_constructor_details) as results from get_constructor_details