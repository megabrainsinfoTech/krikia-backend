SELECT 
    ListingPlans.*,
    Listings.name AS listingName,
    Listings.address AS listingAddress,
    Listings.type AS listingType,
    Listings.images AS image,
    Businesses.name AS businessName,
    Businesses.alias AS businessAlias,
    (
    	SELECT
            CASE
                WHEN discount = 0 THEN NULL
                ELSE price
            END
            FROM ListingPlans
            WHERE listingId = :id AND size= :size

    ) AS originalPrice,
    (
        SELECT
            CASE
                WHEN discount LIKE '%#' THEN
                    price - (price * CAST(SUBSTRING(discount, 1, LENGTH(discount) - 1) AS DECIMAL) / 100)
                ELSE
                    price - CAST(discount AS DECIMAL)
            END
        FROM ListingPlans
        WHERE listingId = :id AND size= :size
    ) AS price,
    (
        SELECT
            CASE
                WHEN l.type = 'Land' THEN CONCAT(CAST(lp.size AS CHAR), ' SQM Land area')
                WHEN l.type = 'Shop' THEN CONCAT(CAST(lp.size AS CHAR), ' SQM Shop space')
                WHEN l.type = 'House' THEN
                    CASE
                        WHEN l.houseType IS NOT NULL AND l.bedrooms IS NOT NULL THEN
                            CONCAT(CAST(l.bedrooms AS CHAR), CASE WHEN l.bedrooms > 1 THEN ' bedrooms ' ELSE ' bedroom ' END , l.houseType)
                        ELSE 'House details not available'
                    END
                ELSE 'Type not recognized'
            END
        FROM Listings AS l
        JOIN ListingPlans AS lp ON l.id = lp.listingId
        WHERE l.id = Listings.id AND lp.size =:size
        LIMIT 1
    ) AS description
FROM ListingPlans
JOIN Listings ON Listings.id = ListingPlans.listingId
JOIN Businesses ON Businesses.id = Listings.businessId
WHERE ListingPlans.listingId = :id AND ListingPlans.size = :size;
