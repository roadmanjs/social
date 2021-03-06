import {Field, InputType, Model, ObjectType} from 'couchset';

export const PostModelName = 'Post';

@InputType('PostInput')
@ObjectType()
export class Post {
    @Field(() => String, {nullable: true})
    id?: string;
    @Field(() => Date, {nullable: true})
    createdAt?: Date;
    @Field(() => Date, {nullable: true})
    updatedAt?: Date;

    @Field(() => String, {nullable: false})
    owner?: string; // userId

    @Field(() => String, {
        nullable: false,
    })
    text: string;

    @Field(() => String, {
        nullable: true,
    })
    replyToId?: string; // if reply post

    @Field(() => String, {nullable: true})
    parentId?: string;

    @Field(() => Boolean, {nullable: true})
    sensitive?: boolean;

    // TODO should be an enum when am sure about all cases
    @Field(() => String, {
        nullable: true,
    })
    visibility?: string; // "draft" "private", "public", "friends/followers"

    @Field(() => String, {
        nullable: true,
    })
    spoilerText?: string;

    @Field(() => String, {
        nullable: true,
    })
    reply?: boolean; // anyone can quote back or repost.

    @Field(() => String, {nullable: true})
    language?: string;

    @Field(() => Date, {nullable: true})
    editedAt?: Date;

    // Just count
    @Field(() => Number, {nullable: true})
    reactions?: number;

    // TODO when enum completed
    // Reaction count by types
    // { likes: 0, dislikes: 2 ... }
    // reactionsTypes: Object

    // ARRAYS begin here

    // TODO record when close price, to be used to compare when post was posted.
    // secIds: PostSecurity[]; // a list of securities in this post, stocks, cryptos, options e.t.c

    @Field(() => [String], {nullable: true})
    attachments?: string[]; // TODO PostAttachment, with caption, for now just string url

    // urls: string[]; // TODO PostLink
    // hashtags: string[];
    // ARRAYS end here
}

// TODO add for public when public and none public is defined
export const postSelectors = [
    'id',
    'owner',
    'text',
    'replyToId',
    'parentId',
    'sensitive',
    'visibility',
    'spoilerText',
    'reply',
    'language',
    'editedAt',
    'reactions',
    'attachments',
    'createdAt',
    'updatedAt',
];

export const PostModel = new Model(PostModelName);

export default Post;
