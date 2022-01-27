import { Field, InputType, ObjectType } from "couchset";

@InputType("PostSecurity")
@ObjectType()
export class PostSecurity {
    symbol: string;
    secType: string;
    close: number;
    closeDate: Date; // or just use internal createdAt in couchset
    info: any; // any additional info for this symbol
};

