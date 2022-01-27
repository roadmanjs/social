import {Field, InputType, Model, ObjectType} from 'couchset';

// import {PostSecurity} from './PostSecurity.model';

ObjectType();
InputType('PostInput');
export class Post {
    @Field(() => String, {nullable: false, description: 'The account that posted this'})
    accountId = ''; // userId

    @Field(() => String, {
        nullable: false,
        description: 'HTML code WYSIWYG editor or some markdown',
    })
    text = '';

    @Field(() => String, {
        nullable: false,
        description: 'Reply to another post, just like a quote tweet',
    })
    replyToId = ''; // if reply post

    @Field(() => String, {nullable: true, description: 'Like if reposted, or retweeted'})
    parentId?: string = '';

    @Field(() => Boolean, {nullable: true, defaultValue: false})
    sensitive?: boolean = false;

    // TODO should be an enum when am sure about all cases
    @Field(() => String, {
        nullable: true,
        defaultValue: 'draft',
        description: 'Visibility of a post, set by OP',
    })
    visibility?: string = 'draft'; // "draft" "private", "public", "friends/followers"

    @Field(() => String, {
        nullable: true,
        description: 'Feeds catchy title if lengthy post',
    })
    spoilerText?: string = '';

    @Field(() => String, {
        nullable: true,
        defaultValue: true,
        description: 'If people can reply to it',
    })
    reply = true; // anyone can quote back or repost.

    @Field(() => String, {nullable: true, defaultValue: 'en'})
    language?: string = '';

    @Field(() => Date, {nullable: true})
    editedAt?: Date = new Date();

    // Just count
    @Field(() => Number, {nullable: true})
    reactions = 0;

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

export const PostModel = new Model(Post.name, {graphqlType: Post});

export const {
    resolver: PostDefaultResolver, // there's going to be other custom resolvers
    pagination: PostPagination,
    client: PostClient,
    modelKeys: PostModelKeys,
} = PostModel.automate();
