WITH get_constructor_details AS (
    SELECT constructors.id, constructors.name, constructors.country, constructors.logo_path, COALESCE(json_agg(models) FILTER (WHERE models.constructor_id IS NOT NULL), '[]') as models
    FROM constructors 
    LEFT JOIN models ON constructors.id = models.constructor_id
    WHERE constructors.id = $1
    GROUP BY constructors.id
    ORDER BY constructors.id
)
SELECT row_to_json(get_constructor_details) as results from get_constructor_details