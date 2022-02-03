import {SocialResTypeFragment} from '../shared';
import gql from 'graphql-tag';

export const MUTATION_POST_DELETE = gql`
    mutation PostDelete($id: String!) {
        postDelete(id: $id) {
            ...SocialResTypeFragment
        }
    }
    ${SocialResTypeFragment}
`;

export const MUTATION_POST_CHANGE_VISIBILITY = gql`
    mutation PostChangeVisibility($id: String!, $visibility: String!) {
        postChangeVisibility(id: $id, visibility: $visibility) {
            ...SocialResTypeFragment
        }
    }
    ${SocialResTypeFragment}
`;

export const MUTATION_POST_CREATE = gql`
    mutation PostCreate($args: PostInput!) {
        postCreate(args: $args) {
            ...SocialResTypeFragment
        }
    }
    ${SocialResTypeFragment}
`;
