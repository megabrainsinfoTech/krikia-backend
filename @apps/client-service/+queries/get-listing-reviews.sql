SELECT 
    Reviews.rating AS rating,
    Reviews.comment As comment,
    Reviews.reviewFor AS label,
    Reviews.updatedAt As reviewedAt,
    JSON_OBJECT(
        'email', Users.email,
        'name', CONCAT(Users.firstName, ' ', Users.lastName),
        'imgUrl', Users.avatarUrl
    ) AS `by`,
    JSON_OBJECT(
        'comment', ReviewReplies.comment,
        'by', JSON_OBJECT(
            'name', Businesses.name,
            'imgUrl', Businesses.logoUrl
        )
    ) AS reply
FROM Reviews
JOIN Users ON Reviews.UserId = Users.id
LEFT JOIN ReviewReplies ON Reviews.id = ReviewReplies.reviewId
LEFT JOIN Listings ON Listings.id = Reviews.listingId
LEFT JOIN Businesses ON Listings.businessId = Businesses.id
WHERE Reviews.listingId = :listingId;
