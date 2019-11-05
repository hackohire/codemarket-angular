
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
    }
    ${description}
    `,
};
