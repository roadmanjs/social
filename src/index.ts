import 'reflect-metadata';

import {CommentDefaultResolver} from './comment/Comment.model';
import {PostResolver} from './post/resolver/Post.resolver';
import {ReactionDefaultResolver} from './reaction/Reaction.model';

export const getSocialResolvers = () => [
    PostResolver,
    CommentDefaultResolver,
    ReactionDefaultResolver,
];
