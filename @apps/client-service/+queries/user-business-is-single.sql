SELECT
    CASE WHEN COUNT(businessId) > 1 
        THEN NULL
        ELSE MAX(CONCAT("@", Businesses.alias))
    END AS business
FROM UserBusinesses
JOIN Businesses ON UserBusinesses.businessId = Businesses.id
WHERE userId = :userId
GROUP BY userId;