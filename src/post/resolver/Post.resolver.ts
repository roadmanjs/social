import {log} from '@roadmanjs/logs';
import {awaitTo} from '@stoqey/client-graphql';
import {Resolver, Query, UseMiddleware, Mutation, Arg, ResTypeFragment, Ctx, getPagination} from 'couchset';
import {isAuth} from '@roadmanjs/auth';
import Post, {PostInput, PostFragment, PostModel} from '../model/Post.model';
import gql from 'graphql-tag';
import {getClassKeys, SocialResType, ContextType} from '../../_shared/ContextType';

const PostPagination = getPagination(Post);
const PostModelKeys = getClassKeys(Post);

/**
 *  ----------------------------- CLIENT GQL BEGIN -----------------------------
 */
export const QUERY_POST = gql`
    query Posts($filter: String, $owner: String!, $page: Number, $limit: Number) {
        posts(filter: $filter, owner: $owner, page: $page, limit: $limit) {
            ...PostFragment
        }
    }
    ${PostFragment}
`;

export const MUTATION_POST_DELETE = gql`
    mutation PostDelete($id: String!) {
        postDelete(id: $id) {
            ...SocialResTypeFragment
        }
    }
    ${ResTypeFragment}
`;

export const MUTATION_POST_CHANGE_VISIBILITY = gql`
    mutation PostChangeVisibility($id: String!, $visibility: String!) {
        postChangeVisibility(id: $id, visibility: $visibility) {
            ...SocialResTypeFragment
        }
    }
    ${ResTypeFragment}
`;

export const MUTATION_POST_CREATE = gql`
    mutation PostCreate($args: PostInput!) {
        postCreate(args: $args) {
            ...SocialResTypeFragment
        }
    }
    ${ResTypeFragment}
`;
/**
 * ----------------------------- CLIENT GQL END -----------------------------
 */

@Resolver()
export class PostResolver {
    @Query(() => PostPagination)
    @UseMiddleware(isAuth)
    async posts(
        @Arg('filter', () => String, {nullable: true}) filter: string,
        @Arg('owner', () => String, {nullable: false}) owner: string, // TODO use from context and not args
        @Arg('page', () => Number, {nullable: true}) page: number,
        @Arg('limit', () => Number, {nullable: true}) limit: number
    ): Promise<Post[]> {
        try {
            const wherers: any = {
                owner: {$eq: owner},
            };

            const selectors = PostModelKeys;

            const data = await PostModel.pagination({
                select: selectors,
                where: wherers,
                limit,
                page,
            });

            return data;
        } catch (error) {
            log('error getting ads listing methods', error);
            return [];
        }
    }

    @Mutation(() => SocialResType)
    @UseMiddleware(isAuth)
    async postDelete(
        @Arg('id', () => String, {nullable: false}) id: string
    ): Promise<SocialResType> {
        try {
            // TODO check if we own this, just pass context and fetch this object before delete
            // Since isAuth already provides owner or current loggedin user
            const deleted = await PostModel.delete(id);
            if (!deleted) {
                throw new Error('Post not deleted');
            }

            return {
                success: true,
            };
        } catch (error) {
            log('error deleting Post', error);
            return {success: false, message: error && error.message};
        }
    }

    @Mutation(() => SocialResType)
    @UseMiddleware(isAuth)
    async postChangeVisibility(
        @Arg('id', () => String, {nullable: false}) id: string,
        @Arg('visibility', () => String, {nullable: false}) visibility: string
    ): Promise<SocialResType> {
        try {
            const [err, adToEdit] = await awaitTo(PostModel.findById(id));
            if (err) {
                throw new Error('Post not found');
            }

            const [errEdit, edited] = await awaitTo(
                PostModel.updateById(id, {
                    ...adToEdit,
                    visibility,
                })
            );

            if (errEdit) {
                throw new Error('Post not edited');
            }

            return {
                success: true,
                data: edited,
            };
        } catch (error) {
            log('error deleting Post', error);
            return {success: false, message: error && error.message};
        }
    }

    @Mutation(() => SocialResType)
    async postCreate(
        @Ctx() _ctx: ContextType,
        @Arg('args', () => PostInput, {nullable: true}) args: PostInput
    ): Promise<SocialResType> {
        try {
            // If updating
            const createdOrUpdate = await PostModel.create({
                model: PostModel,
                data: {
                    ...args,
                },
                ...args, // id and owner if it exists
            });

            if (createdOrUpdate) {
                return {success: true, data: createdOrUpdate};
            }

            throw new Error('error creating Post method ');
        } catch (err) {
            console.error(err && err.message, err);
            return {success: false, message: err && err.message};
        }
    }
}
