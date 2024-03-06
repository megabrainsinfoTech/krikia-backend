declare module 'http-errors';
declare module 'ms';
declare module 'bcryptjs';

type PrimaryKey<T>  = T;

type ModelActionProperties<T> = {
    where: { 
        [Key in keyof T]?: T[Key]
     }
}

/**
 * Makes every type field optional
 */
type Optional<T> = {
    [Key in keyof T]?: T[Key]
}

type PaymentStatus = "Completed"|"Pending"|"Cancelled";
type PaymentFrequency = "Weekly"|"Monthly";
type Gender = "Male"|"Female"|"Unspecified";

interface Landmark {
    address: string;
}

interface Amenity {
    label: string;
}

interface FAQ {
    question: string;
    answer: string;
}