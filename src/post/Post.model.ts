import {InputType, Model, ObjectType} from 'couchset';

import { PostSecurity } from './PostSecurity.model';

ObjectType();
InputType('PostInput');
export class Post {
    accountId: string; // userId

    text: string; // HTML code or some special markup

    replyToId: string; // if reply post

    parentId: string; // og post, repost or something

    sensitive: boolean;
    visibility: boolean;

    spoilerText: string;

    reply: boolean; // anyone can quote back or repost.

    language: string;

    editedAt: Date;

    // ARRAYS begin here

    // TODO record when close price, to be used to compare when post was posted.
    secIds: PostSecurity[]; // a list of securities in this post, stocks, cryptos, options e.t.c
    attachments: string[]; // TODO PostAttachment
    urls: string[]; // TODO PostLink
    hashtags: string[];
    // ARRAYS end here

}
