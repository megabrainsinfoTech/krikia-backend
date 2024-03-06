SELECT
    role,
    UserBusinesses.createdAt,
    (
        SELECT email
            FROM Users
        WHERE id = :userId
    ) AS user,
    (
        SELECT registeredCompanyName
            FROM Businesses
        WHERE id = :businessId
    ) AS registeredCompanyName,
    (
        SELECT id
            FROM Businesses
        WHERE id = :businessId
    ) AS id
FROM UserBusinesses
JOIN Users ON Users.id = UserBusinesses.userId
JOIN Businesses ON Businesses.id = UserBusinesses.businessId
WHERE userId = :userId AND businessId = :businessId
GROUP BY UserBusinesses.id