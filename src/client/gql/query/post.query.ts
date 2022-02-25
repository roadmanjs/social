import {PostPaginationFragment} from '../fragments';
import gql from 'graphql-tag';

export const POST_QUERY = gql`
    query Posts(
        $filter: String
        $sort: String
        $before: DateTime
        $after: DateTime
        $owner: String
        $limit: Float
    ) {
        posts(
            filter: $filter
            sort: $sort
            before: $before
            after: $after
            owner: $owner
            limit: $limit
        ) {
            ...PostPaginationFragment
        }
    }
    ${PostPaginationFragment}
`;
