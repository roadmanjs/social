import {Field, InputType, ObjectType} from 'couchset';

InputType('FollowRecommendationInput');
ObjectType();
export class FollowRecommendationSuppression {
    @Field(() => String, {nullable: false})
    accountId = '';
}
