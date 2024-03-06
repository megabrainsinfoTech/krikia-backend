SELECT 
    role, businessId, createdAt,
    (
        SELECT registeredCompanyName
        FROM Businesses
        WHERE id = businessId
    ) AS name
FROM UserBusinesses
WHERE userId = :userId