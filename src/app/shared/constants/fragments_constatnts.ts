import gql from 'graphql-tag';

export const headerFragment = gql`
fragment Header on HeaderBlock {
    type
    _id
    data {
      text
      level
    }
}
`;

export const paragraphFragment = gql`
fragment Paragraph on ParagraphBlock {
    type
    _id
    data {
      text
    }
}
`;

export const codeFragment = gql`
fragment Code on CodeBlock {
  type
  _id
  data {
    code
    language
  }
}
`;

export const imageFragment = gql`
    fragment Image on ImageBlock {
    type
    _id
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
  _id
  data {
    style
    items
  }
}
`;

export const quoteFragment = gql`
  fragment Quote on QuoteBlock {
    type
    _id
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
    _id
    data {
      content
    }
  }
`;

export const warningFragment = gql`
  fragment Warning on WarningBlock {
    type
    _id
    data {
      title
      message
    }
  }
`;

export const embedFragment = gql`
    fragment Embed on EmbedBlock {
    type
    _id
    data {
        caption
        width
        height
        service
        source
        embed
    }
}
`;

export const linkToolFragment = gql`
  fragment LinkTool on LinkToolBlock {
    type
    _id
    data {
      link
      meta {
        title
        description
        domain
        url
        image {
          url
        }
      }
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
        ...Embed
        ...LinkTool
    }
    ${codeFragment}
    ${imageFragment}
    ${paragraphFragment}
    ${headerFragment}
    ${listFragment}
    ${quoteFragment}
    ${tableFragment}
    ${warningFragment}
    ${embedFragment}
    ${linkToolFragment}
`;

export const comment = gql`
fragment Comment on Comment {
  text {
    ...Description
  }
  _id
  type
  referenceId
  parentId
  createdAt
  createdBy {
    _id
    name
    avatar
  }
  children {
    _id
    text {
      ...Description
    }
    createdAt
    createdBy {
      _id
      name
      avatar
    }
    parentId
    referenceId
  }
  blockId
  blockSpecificComment
}
${description}
`;
