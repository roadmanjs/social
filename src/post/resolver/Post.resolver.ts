import {log} from '@roadmanjs/logs';
import {awaitTo} from '@stoqey/client-graphql';
import {Resolver, Query, UseMiddleware, Mutation, Arg, Ctx, createUpdate} from 'couchset';
import {isAuth} from '@roadmanjs/auth';
import {Post, PostModel, postSelectors} from '../model/Post.model';
import {SocialResType, ContextType, getPagination} from '../../_shared/ContextType';

const PostPagination = getPagination(Post);

@Resolver()
export class PostResolver {
    // TODO myPosts and public posts

    @Query(() => PostPagination)
    @UseMiddleware(isAuth)
    async posts(
        @Arg('filter', () => String, {nullable: true}) filter: string, // TODO filters
        @Arg('owner', () => String, {nullable: false}) owner: string, // TODO use from context and not args
        @Arg('page', () => Number, {nullable: true}) page: number,
        @Arg('limit', () => Number, {nullable: true}) limit: number
    ): Promise<Post[]> {
        try {
            const wherers: any = {
                owner: {$eq: owner},
                // visibility: {$neq: "draft"} // TODO for public or fetch my current user posts
            };

            const selectors = postSelectors;

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
        @Arg('args', () => Post, {nullable: true}) args: Post
    ): Promise<SocialResType> {
        try {
            const createdOrUpdate = await createUpdate({
                model: PostModel,
                data: {
                    ...args,
                },
                ...args, // id if exists
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
