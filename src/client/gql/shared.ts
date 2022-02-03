import gql from 'graphql-tag';

export interface SocialResType {
    success: boolean;
    message?: string;
    data?: any;
}

export const SocialResTypeFragment = gql`
    fragment SocialResTypeFragment on SocialResType {
        success
        message
        data
    }
`;
