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

export const listFragment = gql`
fragment List on ListBlock {
  type
  data {
    style
    items
  }
}
`;

export const quoteFragment = gql`
  fragment Quote on QuoteBlock {
    type
    data {
      text
      caption
      alignment
    }
  }
`;

export const tableFragment = gql`
  fragment Table on TableBlock {
    type
    data {
      content
    }
  }
`;

export const warningFragment = gql`
  fragment Warning on WarningBlock {
    type
    data {
      title
      message
    }
  }
`;


export const description = gql`
    fragment Description on descriptionBlocks {
        ...Code
        ...Image
        ...Paragraph
        ...Header
        ...List
        ...Quote
        ...Table
        ...Warning
    }
    ${codeFragment}
    ${imageFragment}
    ${paragraphFragment}
    ${headerFragment}
    ${listFragment}
    ${quoteFragment}
    ${tableFragment}
    ${warningFragment}
`;
