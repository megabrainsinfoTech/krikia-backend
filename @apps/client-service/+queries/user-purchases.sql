SELECT 

    paidAmount,
    totalAmount,
    paymentFrequency,
    lastPaidDate,
    expectedPayEndDate,
    Purchases.id AS id,
    Purchases.createdAt,
    nextPayDate,
    nextPayAmount,
    1 As quantity,
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
        LIMIT 1
    ) AS description,
    paymentStatus,
    Businesses.alias As businessAlias,
    Businesses.registeredCompanyName AS businessName,
    Listings.address AS propertyAddress,
    Listings.type AS propertyType
FROM Purchases
JOIN ListingPlanOptions ON Purchases.ListingPlanOptionId = ListingPlanOptions.id
RIGHT JOIN ListingPlans AS lp ON ListingPlanOptions.ListingPlanId = lp.id
JOIN Listings ON lp.ListingId = Listings.id
JOIN Businesses ON Listings.BusinessId = Businesses.id
WHERE UserId = :UserId