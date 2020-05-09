
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
                jobProfile {
                    name
                    _id
                    type
                }
            }
        }
        type
        categories
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
        }
        likeCount
        slug
        comments {
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
    `,
};
