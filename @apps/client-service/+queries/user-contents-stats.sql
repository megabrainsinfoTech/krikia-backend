SELECT 
    id,
    (
        SELECT COUNT(*) FROM Wishlists WHERE userId =:userId
    ) AS wishlistContentsCount,
    (
        SELECT COUNT(*) FROM Purchases WHERE userId =:userId
    ) AS purchaseCount

FROM Users
WHERE id =:userId