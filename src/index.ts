import {CommentDefaultResolver} from './comment/Comment.model';
import {PostDefaultResolver} from './post/model/Post.model';
import {ReactionDefaultResolver} from './reaction/Reaction.model';

export const getSocialResolvers = () => [
    CommentDefaultResolver,
    PostDefaultResolver,
    ReactionDefaultResolver,
];
