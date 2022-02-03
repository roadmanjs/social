import gql from 'graphql-tag';

export interface ResType {
    success: boolean;
    message?: string;
    data?: any;
}

export const SocialResTypeFragment = gql`
    fragment SocialResTypeFragment on ResType {
        success
        message
        data
    }
`;
