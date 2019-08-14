import gql from 'graphql-tag';

export const headerFragment = gql`
fragment Header on HeaderBlock {
    type
    data {
      text
      level
    }
}
`;

export const paragraphFragment = gql`
fragment Paragraph on ParagraphBlock {
    type
    data {
      text
    }
}
`;

export const codeFragment = gql`
fragment Code on CodeBlock {
  type
  data {
    code
    language
  }
}
`;

export const imageFragment = gql`
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

export const description = gql`
    fragment Description on descriptionBlocks {
        ...Code
        ...Image
        ...Paragraph
        ...Header
    }
    ${codeFragment}
    ${imageFragment}
    ${paragraphFragment}
    ${headerFragment}
`;
