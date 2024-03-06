-- I want to get totalOrder, newOrdersCount, completedOrders, cancelledOrders and 

SELECT COUNT(*) AS totalPurchaseCount,
(
    SELECT COUNT(*) FROM Purchases WHERE userId IS NULL
) AS cancelledPurchaseCount,
(
    SELECT COUNT(*) FROM Purchases WHERE userId IS NOT NULL
) AS soldPurchaseCount,
(
    SELECT COUNT(*) FROM Purchases WHERE userId IS NOT NULL
) AS inProgressPurchaseCount
FROM Purchases
WHERE sellerId = :sellerId
LIMIT 1