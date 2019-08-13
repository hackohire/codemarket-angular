
import gql from 'graphql-tag';

const codeFragment = gql`
fragment Code on CodeBlock {
  type
  data {
    code
    language
  }
}
`;

const imageFragment = gql`
    fragment Image on ImageBlock {
    type
    data {
        caption
        file {
            url
        }
        stretched
        withBackground
        withBorder
    }
}
`;


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
            ...Code
            ...Image
        }
        shortDescription
        demo_url
        video_url
        documentation_url
        totalPrice
        status
        createdAt
        updatedAt
        snippets {
            language
        }
    }
    ${codeFragment}
    ${imageFragment}
    `,
};
