SELECT 
    -- ListingPlans.*,
    ListingPlans.ListingId AS listingId,
    ListingPlanOptions.discount AS discount,
    Listings.name AS listingName,
    Listings.address AS listingAddress,
    ListingPlanOptions.initialDeposit AS minimumDeposit,
    Listings.type AS listingType,
    Listings.images AS `image`,
    ListingPlanOptions.tiers AS tiers,
    ListingPlanOptions.paymentDuration AS duration,
    Businesses.name AS businessName,
    Businesses.alias AS businessAlias,
    (
        SELECT id
            FROM ListingPlanOptions
        WHERE listingPlanId = ListingPlans.id AND paymentDuration = :pDuration
    ) AS listingPlanOptionId,
    (
    	SELECT
            CASE
                WHEN discount = 0 THEN NULL
                ELSE price
            END
            FROM ListingPlanOptions
            WHERE paymentDuration = :pDuration AND listingPlanId = ListingPlans.id

    ) AS originalPrice,
    (
        SELECT
            CASE
                WHEN discount LIKE '%#' THEN
                    price - (price * CAST(SUBSTRING(discount, 1, LENGTH(discount) - 1) AS DECIMAL) / 100)
                ELSE
                    price - CAST(discount AS DECIMAL)
            END
        FROM ListingPlanOptions
        WHERE paymentDuration = :pDuration AND listingPlanId = ListingPlans.id
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
JOIN ListingPlanOptions ON ListingPlanOptions.listingPlanId = ListingPlans.id
JOIN Businesses ON Businesses.id = Listings.businessId
WHERE ListingPlans.listingId = :id AND ListingPlans.size = :size AND ListingPlanOptions.paymentDuration = :pDuration;
