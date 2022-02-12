import {Field, InputType, Model, ObjectType} from 'couchset';

@InputType('CommentInput')
@ObjectType()
export class Comment {
    @Field(() => String, {nullable: true, description: 'The account that posted this'})
    owner = ''; // userId

    @Field(() => String, {
        nullable: true,
        description: 'HTML code WYSIWYG editor or some markdown',
    })
    text = '';

    @Field(() => String, {nullable: true, description: 'Replied to parent comment'})
    parentId?: string = '';

    @Field(() => Date, {nullable: true})
    editedAt?: Date = new Date();

    // use dates to paginate, createdAt

    // TODO Reaction counts and counts by types
    // Add reactions
}

export const CommentModel = new Model(Comment.name, {graphqlType: Comment});

// automatic

export const {
    resolver: CommentDefaultResolver, // there's going to be other custom resolvers
    pagination: CommentPagination,
    client: CommentClient,
    modelKeys: CommentModelKeys,
} = CommentModel.automate();
