SELECT
  AVG(Reviews.rating) AS averageRating,
  all_ratings.rating,
  COUNT(Reviews.rating) AS rating_count
FROM (
  SELECT 0 AS rating
  UNION SELECT 1
  UNION SELECT 2
  UNION SELECT 3
  UNION SELECT 4
  UNION SELECT 5
) all_ratings
LEFT JOIN Reviews ON all_ratings.rating = Reviews.rating AND Reviews.ListingId = :listingId
GROUP BY all_ratings.rating
ORDER BY all_ratings.rating;
