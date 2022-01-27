import {Field, InputType, Model, ObjectType} from 'couchset';

export type Reactions = 'like' | 'dislike' | 'cry' | 'laugh'; // e.t.c to add any unlimited

@ObjectType()
@InputType('ReactionInput')
export class Reaction {
    @Field(() => String, {nullable: false, description: 'The account that posted this'})
    accountId = ''; // userId

    // TODO enum when POC completed
    @Field(() => String, {
        nullable: false,
        description: 'Reply to another post, just like a quote tweet',
    })
    reaction = ''; // if reply post

    @Field(() => String, {nullable: false})
    postId = '';

    // ... createdAt, updatedAt, id are all added by couchset
}

export const ReactionModel = new Model(Reaction.name, {graphqlType: Reaction});

export const {
    resolver: ReactionDefaultResolver, // there's going to be other custom resolvers
    pagination: ReactionPagination,
    client: ReactionClient,
    modelKeys: ReactionModelKeys,
} = ReactionModel.automate();
