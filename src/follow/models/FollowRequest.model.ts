import {Field, InputType, ObjectType} from 'couchset';

InputType('FollowRequestInput');
ObjectType();
export class FollowRequest {
    @Field(() => String, {nullable: false})
    accountId = '';

    @Field(() => String, {nullable: false})
    targetAccountId = '';

    @Field(() => String, {nullable: true})
    uri?: string = '';

    @Field(() => Boolean, {nullable: false, defaultValue: false})
    notify = false;
}
