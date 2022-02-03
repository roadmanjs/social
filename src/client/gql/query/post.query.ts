import {PostFragment} from '../fragments';
import gql from 'graphql-tag';

export const QUERY_POST = gql`
    query Posts($filter: String, $owner: String!, $page: Number, $limit: Number) {
        posts(filter: $filter, owner: $owner, page: $page, limit: $limit) {
            ...PostFragment
        }
    }
    ${PostFragment}
`;
