import {Field, InputType, Model, ObjectType} from 'couchset';

InputType('FollowRecommendationInput');
ObjectType();
export class FollowRecommendationSuppression {
    @Field(() => String, {nullable: false})
    accountId = '';
}
