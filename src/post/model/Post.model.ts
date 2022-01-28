// Database model and a graphql fragment
import {Field, InputType, Model, ObjectType} from 'couchset';

import gql from 'graphql-tag';

export const PostFragment = gql`
    fragment PostFragment on Post {
        id
        accountId
        text
        replyToId
        parentId
        sensitive
        visibility
        spoilerText
        reply
        language
        editedAt
        reactions
        createdAt
        updatedAt
    }
`;

InputType('PostInput');
ObjectType();
export class Post {
    @Field(() => String, {nullable: false, description: 'The account that posted this'})
    accountId: string; // userId

    @Field(() => String, {
        nullable: false,
        description: 'HTML code WYSIWYG editor or some markdown',
    })
    text: string;

    @Field(() => String, {
        nullable: false,
        description: 'Reply to another post, just like a quote tweet',
    })
    replyToId: string; // if reply post

    @Field(() => String, {nullable: true, description: 'Like if re-posted, or retweeted'})
    parentId?: string;

    @Field(() => Boolean, {nullable: true})
    sensitive?: boolean;

    // TODO should be an enum when am sure about all cases
    @Field(() => String, {
        nullable: true,
        description: 'Visibility of a post, set by OP',
    })
    visibility?: string; // "draft" "private", "public", "friends/followers"

    @Field(() => String, {
        nullable: true,
        description: 'Feeds catchy title if lengthy post',
    })
    spoilerText?: string;

    @Field(() => String, {
        nullable: true,
        description: 'If people can reply to it',
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
    // attachments: string[]; // TODO PostAttachment
    // urls: string[]; // TODO PostLink
    // hashtags: string[];
    // ARRAYS end here
}

export const PostModel = new Model('Post');

export default Post;
