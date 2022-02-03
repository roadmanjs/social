import {SocialResTypeFragment} from '../shared';
import gql from 'graphql-tag';

export const POST_DELETE_MUTATION = gql`
    mutation PostDelete($id: String!) {
        data: postDelete(id: $id) {
            ...SocialResTypeFragment
        }
    }
    ${SocialResTypeFragment}
`;

export const POST_CHANGE_VISIBILITY_MUTATION = gql`
    mutation PostChangeVisibility($id: String!, $visibility: String!) {
        data: postChangeVisibility(id: $id, visibility: $visibility) {
            ...SocialResTypeFragment
        }
    }
    ${SocialResTypeFragment}
`;

export const POST_CREATE_MUTATION = gql`
    mutation PostCreate($args: PostInput!) {
        data: postCreate(args: $args) {
            ...SocialResTypeFragment
        }
    }
    ${SocialResTypeFragment}
`;
