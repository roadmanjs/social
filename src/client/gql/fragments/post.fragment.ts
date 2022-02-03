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
        attachments
        createdAt
        updatedAt
    }
`;
