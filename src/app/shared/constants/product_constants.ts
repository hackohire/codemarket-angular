export const productConstants = {
    productQueryFields: `
        _id
        name
        createdBy {
            _id
            name
        }
        categories
        description
        shortDescription
        demo_url
        video_url
        documentation_url
        totalPrice
        status
    `,
};
