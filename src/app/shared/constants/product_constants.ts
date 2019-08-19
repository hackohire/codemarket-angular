
import gql from 'graphql-tag';
import { description } from './fragments_constatnts';


export const productConstants = {
    productQueryFields: gql`
    fragment Product on Product {
        _id
        name
        createdBy {
            _id
            name
        }
        categories
        description {
            ...Description
        }
        shortDescription
        demo_url
        video_url
        documentation_url
        totalPrice
        status
        createdAt
        updatedAt
        tags {
            name
        }
    }
    ${description}
    `,
};
