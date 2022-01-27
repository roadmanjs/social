import { Field, InputType, ObjectType } from "couchset";

/**
 * Just for records, 
 * Querying will be done by another package
 * e.g Hashtags can be queried from this package not an external package.
 */
@InputType("PostSecurity")
@ObjectType()
export class PostSecurity {
    symbol: string;
    secType: string;
    close: number;
    closeDate: Date; // or just use internal createdAt in couchset
    info: any; // any additional info for this symbol
};