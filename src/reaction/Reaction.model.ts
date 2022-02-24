import {Field, InputType, Model, ObjectType} from 'couchset';

export type Reactions = 'like' | 'dislike' | 'cry' | 'laugh'; // e.t.c to add any unlimited

@ObjectType()
@InputType('ReactionInput')
export class Reaction {
    @Field(() => String, {nullable: true, description: 'The account that posted this'})
    owner = ''; // userId

    // TODO enum when POC completed
    @Field(() => String, {
        nullable: true,
        description: 'Reply to another post, just like a quote tweet',
    })
    reaction = ''; // if reply post

    @Field(() => String, {nullable: true})
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
