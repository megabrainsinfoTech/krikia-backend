const dayjs = require('dayjs');
const { Subscription, Property, business, SubscriptionEntry } = require('../models');

module.exports = async (customerId, subscriptionId)=> {

    const sub = await Subscription.findOne({ 
        where: { id: subscriptionId, customerId: customerId },
        include: [
          {
            model: Property,
            as: "property",
            attributes: ["propertyType"],
          },
          {
            model: business,
            as: "business",
            attributes: ["id","email"],
          }
        ],
      })

      for(;;){
        let lastEntry = (await SubscriptionEntry.findAll({
          where: {
              subscriptionId: subscriptionId
          },
          order: [["iat", "DESC"]],
          limit: 1,
          raw: true
        
        }))[0];

        // console.log("Entry")
        // console.log(lastEntry)

        if(lastEntry && (dayjs(lastEntry.iat) <= dayjs()) && (dayjs(lastEntry.iat).add(1, sub.paymentTier.replace("ly", "")) <= dayjs(sub.completionDate))){
            // Create next subscription entry
            lastEntry = await SubscriptionEntry.create({
                amount: lastEntry.amount,
                balance: 0,
                idx: lastEntry.idx+1,
                iat: dayjs(lastEntry.iat).add(1, sub.paymentTier.replace("ly", "")),
                status: "Pending",
                subscriptionId,
            });
        } else if(lastEntry && (dayjs(lastEntry.iat) < dayjs(sub.completionDate)) && (dayjs(lastEntry.iat).add(1, sub.paymentTier.replace("ly", "")) < dayjs())){
          // Create next subscription entry
            lastEntry = await SubscriptionEntry.create({
                amount: lastEntry.amount,
                balance: 0,
                idx: lastEntry.idx+1,
                iat: dayjs(lastEntry.iat).add(1, sub.paymentTier.replace("ly", "")),
                status: "Missed",
                subscriptionId,
            });
        } else {
          break;
        }
      } 

        

}