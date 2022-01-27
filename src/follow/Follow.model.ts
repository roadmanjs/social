import {Field, InputType, Model, ObjectType} from 'couchset';

ObjectType();
InputType('FollowInput');
export class Follow {
    @Field(() => String, {nullable: false})
    accountId = '';

    @Field(() => String, {nullable: false})
    targetAccountId = '';

    @Field(() => String, {nullable: true})
    uri?: string = '';

    @Field(() => Boolean, {nullable: false, defaultValue: false})
    notify = false;

    // not important for now or never
    // show_reblogs?: boolean;
}
