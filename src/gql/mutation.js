import gql from 'graphql-tag';

export const BOARD_QUERY = gql`
    query($_id: String!, $BoardId: ID!) {
        getBoard(_id: $_id, BoardId: $BoardId) {
            title
            content
            author
            like
            label
        }
    }
`;

export const BOARD_CREATE = gql`
    mutation addBoard(
        $title: String!
        $author: String!
        $content: String!
        $label: [label]
        $BoardId: ID!
    ) {
        addBoard(
            title: $title
            author: $author
            content: $content
            label: $label
            BoardId: $BoardId
        ) {
            title
            author
            content
            label
        }
    }
`;

export const BOARD_UPDATE = gql`
    mutation updateBoard(
        $_id: String
        $title: String
        $content: String
        $label: [label]
        $BoardId: ID!
    ) {
        updateBoard(_id: $_id, title: $title, content: $content, label: $label, BoardId: $BoardId) {
            _id
            title
            content
            label
        }
    }
`;

export const BOARD_DELETE = gql`
    mutation deleteBoard($_id: String, $BoardId: ID!) {
        deleteBoard(_id: $_id, BoardId: $BoardId) {
            _id
        }
    }
`;

export const ADD_LIKE = gql`
    mutation addLike($_id: String, $BoardId: ID!) {
        addLike(_id: $_id, BoardId: $BoardId) {
            _id
        }
    }
`;

export const ADD_DISLIKE = gql`
    mutation addDislike($_id: String, $BoardId: ID!) {
        addDislike(_id: $_id, BoardId: $BoardId) {
            _id
        }
    }
`;
