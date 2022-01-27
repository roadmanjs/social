import {Field, InputType, Model, ObjectType} from 'couchset';

InputType('FollowRecommendationInput');
ObjectType();
export class FollowRecommendation {
    @Field(() => String, {nullable: false})
    accountId = '';

    @Field(() => Number, {nullable: true})
    rank?: number = 0; // probably useless

    @Field(() => [String], {nullable: true})
    reason?: [string] = [''];
}
