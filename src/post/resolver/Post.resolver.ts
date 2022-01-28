import {log} from '@roadmanjs/logs';
import {awaitTo} from '@stoqey/client-graphql';
import {
    Resolver,
    Query,
    UseMiddleware,
    Mutation,
    Arg,
    isAuth,
    ResType,
    ResTypeFragment,
} from 'couchset';
import {Post, PostFragment, PostModel, PostModelKeys} from '../model/Post.model';
import gql from 'graphql-tag';

/**
 *  ----------------------------- CLIENT GQL BEGIN -----------------------------
 */
export const QUERY_POST = gql`
    query Posts {
        posts(filter: String, owner: String, page: Number, limit: Number) {
            ...PostFragment
        }
    }
    ${PostFragment}
`;

export const MUTATION_POST_DELETE = gql`
     query PostDelete{
         postDelete(id: !String, owner: !String){
             ...ResTypeFragment
         }
     }
     ${ResTypeFragment}
`;

export const MUTATION_POST_CHANGE_VISIBILITY = gql`
     query PostChangeVisibility{
         postChangeVisibility(id: !String, visibility: !String){
             ...ResTypeFragment
         }
     }
     ${ResTypeFragment}
`;

export const MUTATION_POST_CREATE = gql`
     query PostCreate{
         postCreate(args: !PostInput){
             ...ResTypeFragment
         }
     }
     ${ResTypeFragment}
`;
/**
 * ----------------------------- CLIENT GQL END -----------------------------
 */

@Resolver()
export class PostResolver {
    // QUERY_POST
    @Query(() => [Post])
    @UseMiddleware(isAuth)
    async posts(
        @Arg('filter', {nullable: true}) filter: string,
        @Arg('owner') owner: string, // TODO use from context and not args
        @Arg('page', {nullable: true}) page: number,
        @Arg('limit', {nullable: true}) limit: number
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

    @Mutation(() => ResType)
    @UseMiddleware(isAuth)
    async postDelete(@Arg('id', {nullable: false}) id: string): Promise<ResType> {
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

    @Mutation(() => ResType)
    @UseMiddleware(isAuth)
    async postChangeVisibility(
        @Arg('id', {nullable: false}) id: string,
        @Arg('visibility', {nullable: false}) visibility: string
    ): Promise<ResType> {
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

    @Mutation(() => ResType)
    @UseMiddleware(isAuth)
    async postCreate(@Arg('args') args: Post): Promise<ResType> {
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
