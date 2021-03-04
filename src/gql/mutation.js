import gql from 'graphql-tag';

export const BOARD_QUERY = gql`
    query($_id: ID!) {
        getBoard(_id: $_id) {
            title
            content
            author
            like
            label
        }
    }
`;

export const BOARD_CREATE = gql`
    mutation addBoard($title: String!, $author: String!, $content: String!, $label: [label]) {
        addBoard(title: $title, author: $author, content: $content, label: $label) {
            title
            author
            content
            label
        }
    }
`;

export const BOARD_UPDATE = gql`
    mutation updateBoard($_id: ID!, $title: String, $content: String, $label: [label]) {
        updateBoard(_id: $_id, title: $title, content: $content, label: $label) {
            _id
            title
            content
            label
        }
    }
`;

export const BOARD_DELETE = gql`
    mutation deleteBoard($_id: ID!) {
        deleteBoard(_id: $_id) {
            _id
        }
    }
`;

export const ADD_LIKE = gql`
    mutation addLike($_id: ID!) {
        addLike(_id: $_id) {
            _id
        }
    }
`;

export const ADD_DISLIKE = gql`
    mutation addDislike($_id: ID!) {
        addDislike(_id: $_id) {
            _id
        }
    }
`;
