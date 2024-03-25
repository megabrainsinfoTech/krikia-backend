import dayjs from 'dayjs';
import { Op } from 'sequelize';
import { Model } from 'sequelize-typescript';
// function DatesFn(prevDate, tier) {
//   let date = null;
//   if (tier === "outright") {
//     return date;
//   } else if (tier === "weekly" || "monthly") {
//     date = 1;
//   }
//   return dayjs(prevDate).add(date, tier.replace("ly", ""));
// }

const CookieExpiryTime = {
  END_OF_SESSION: 0,
  SECOND: 1000,
  MINUTE: 1000 * 60,
  HOUR: 1000 * 60 * 60,
  DAY: 1000 * 60 * 60 * 24,
  YEAR: 1000 * 60 * 60 * 24 * 365,
  NEVER: 1000 * 60 * 60 * 24 * 365 * 20,
};

export const encodeBase64Url = (
  str: string,
  option: BufferEncoding = 'base64url',
) => {
  let txt;
  txt = Buffer.from(`${str}`).toString(option);

  return txt;
};

export const decodeBase64Url = (
  str: string,
  option: BufferEncoding = 'base64url',
) => {
  return Buffer.from(`${str}`, option).toString('ascii');
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
};

interface ICompoundPay {}

const compoundSubscriptionPay = (
  principal: number,
  compoundingFrequency: PaymentFrequency = 'Weekly',
  paymentFrom: string,
  dueForPayDate: string,
  lateFeeRate: string,
  status: string,
) => {
  const interestRate = lateFeeRate || 5; //5%
  const currentDate = dayjs(); // Get the current date
  const dueDate = dayjs(dueForPayDate); // The due date for installment payment

  // Calculate the number of periods missed
  // Calculate the number of periods missed
  // const lastDate = dueDate.subtract(1, compoundingFrequency.replace("ly", ""))
  const periodsMissed = calculatePeriodsMissed(
    dueDate,
    currentDate,
    compoundingFrequency,
    status,
  );
  console.log('Missed', periodsMissed);

  if (
    dayjs(dueForPayDate).add(7, 'days') < dayjs() &&
    dayjs(dueForPayDate).add(
      1,
      (compoundingFrequency as any).replace('ly', 's'),
    ) > dayjs()
  ) {
    return {
      fee: principal,
      charge: 0,
      periodsMissed,
    };
  }

  const compoundValue = calculateCompoundValue(
    principal,
    Number(interestRate),
    periodsMissed,
  );

  return {
    fee: compoundValue - principal,
    charge: compoundValue,
    periodsMissed,
  };
};

// Function to calculate the number of periods missed
const calculatePeriodsMissed = (
  dueDate: any,
  currentDate: any,
  frequency: string,
  status: string,
) => {
  if (status !== 'Paid' && currentDate > dueDate) {
    return currentDate.diff(dueDate, frequency.replace('ly', 's')) + 1;
  }

  return 0;

  // You can add more cases for other frequencies
};

// Function to calculate compound value
const calculateCompoundValue = (
  principal: number,
  rate: number,
  periodsMissed: number,
) => {
  return principal + principal * (rate / 100) * periodsMissed;
};

export const OrdinalNumbering = (idx: number) => {
  let suffix;

  if (idx === 11 || idx === 12 || idx === 13) {
    suffix = 'th';
  } else {
    const lastDigit = idx % 10;
    switch (lastDigit) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd';
        break;
      case 3:
        suffix = 'rd';
        break;
      default:
        suffix = 'th';
    }
  }

  return `${idx}${suffix}`;
};

export const getSellingFee = async (
  sub: Model,
  amount: number,
  MarketplaceFee: Model,
) => {
  // let fee;
  //   if(fee = (await MarketplaceFee.findOne({
  //     where: {
  //       businessId: sub.business.id,
  //       variant: "business",
  //       label: "selling_fee",
  //       ref: {
  //         [Op.is]: null
  //       }
  //     },
  //     raw: true
  //   }))?.value
  //   ) {
  //   } else {
  //     fee = (await MarketplaceFee.findOne({
  //       where: {
  //         businessId: {
  //           [Op.is]: null
  //         },
  //         variant: "krikia",
  //         label: "selling_fee",
  //         ref: {
  //           [Op.is]: null
  //         }
  //       },
  //       raw: true
  //   }))?.value
  //   }
  //   return fee = ((fee?.[sub.property.propertyType]?.amount || 0) + (((fee?.[sub.property.propertyType]?.percentagePlus || 25)/100)*Number(amount)));
};

export function generateRandom6Digits(): number {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
