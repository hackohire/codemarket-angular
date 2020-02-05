
import gql from 'graphql-tag';
import { description } from './fragments_constatnts';


export const productConstants = {
    productQueryFields: gql`
    fragment Product on Product {
        _id
        name
        createdBy {
            name
            avatar
            _id
            currentJobDetails {
                jobProfile
            }
        }
        type
        categories
        description {
            ...Description
        }
        price
        status
        createdAt
        updatedAt
        tags {
            name
            _id
        }
        support {
            time
            description {
                ...Description
            }
        }
        likeCount
        slug
        comments {
            text {
              ...Description
            }
            _id
            type
            referenceId
            companyReferenceId
            userReferenceId
            parentId
            createdAt
            createdBy {
              _id
              name
              avatar
            }
            blockId
            blockSpecificComment
        }
    }
    ${description}
    `,
};
