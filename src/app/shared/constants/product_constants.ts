
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
        categories
        description {
            ...Description
        }
        shortDescription
        demo_url
        video_url
        documentation_url
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
