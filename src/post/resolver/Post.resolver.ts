import {log} from '@roadmanjs/logs';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import _get from 'lodash/get';
import {awaitTo} from '@stoqey/client-graphql';
import {
    Resolver,
    Query,
    UseMiddleware,
    Mutation,
    Arg,
    Ctx,
    createUpdate,
    CouchbaseConnection,
} from 'couchset';
import {isAuth} from '@roadmanjs/auth';
import {Post, PostModel, PostModelName} from '../model/Post.model';
import {SocialResType, ContextType, getPagination} from '../../_shared/ContextType';

const PostPagination = getPagination(Post);

@Resolver()
export class PostResolver {
    @Query(() => PostPagination)
    @UseMiddleware(isAuth)
    async posts(
        @Ctx() ctx: ContextType,
        @Arg('filter', () => String, {nullable: true}) filter?: string,
        @Arg('sort', () => String, {nullable: true}) sortArg?: string,
        @Arg('before', () => Date, {nullable: true}) before?: Date,
        @Arg('after', () => Date, {nullable: true}) after?: Date,
        @Arg('owner', () => String, {nullable: true}) ownerArg?: string,
        @Arg('limit', () => Number, {nullable: true}) limitArg?: number
    ): Promise<{items: Post[]; hasNext?: boolean; params?: any}> {
        const owner = ownerArg || _get(ctx, 'payload.userId', '');
        const bucket = CouchbaseConnection.Instance.bucketName;
        const sign = before ? '<=' : '>=';
        const time = new Date(before || after);
        const sort = sortArg || 'DESC';
        const limit = limitArg || 10;
        const limitPassed = limit + 1; // adding +1 for hasNext

        const copyParams = pickBy(
            {
                sort,
                filter,
                before,
                after,
                owner,
                limit,
            },
            identity
        );

        try {
            const query = `
                SELECT *
                    FROM \`${bucket}\` post
                    WHERE post._type = "${PostModelName}"
                    AND post.owner = "${owner}"
                    AND post.createdAt ${sign} "${time.toISOString()}"
                    ORDER BY post.createdAt ${sort}
                    LIMIT ${limitPassed};
                `;

            const [errorFetching, data = []] = await awaitTo(
                PostModel.customQuery<any>({
                    limit: limitPassed,
                    query,
                    params: copyParams,
                })
            );

            if (errorFetching) {
                throw errorFetching;
            }

            const [rows = []] = data;

            const hasNext = rows.length > limit;

            if (hasNext) {
                rows.pop(); // remove last element
            }

            const dataToSend = rows.map((d) => {
                const {post} = d;
                return PostModel.parse(post);
            });

            return {items: dataToSend, params: copyParams, hasNext};
        } catch (error) {
            log('error getting posts', error);
            return {items: [], hasNext: false, params: copyParams};
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
