SELECT 
    SiteInspections.*,
    Users.email AS user_email,
    Users.phone as user_phone,
    CONCAT(Users.firstName, " ", Users.lastName) as user_name
FROM SiteInspections
JOIN Users ON SiteInspections.UserId = Users.id
WHERE ListingId IN (
    SELECT id
    FROM Listings
    WHERE BusinessId = :businessId
);