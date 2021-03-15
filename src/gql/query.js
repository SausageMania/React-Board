import gql from 'graphql-tag';

export const SCROLL_QUERY = gql`
    query(
        $BoardId: ID!
        $title: String
        $author: String
        $content: String
        $sort: sortingTypes
        $isMatched: Boolean
        $limit: Int
        $lastKey: String
        $createdAt: Date
        $like: Int
    ) {
        searchBoards(
            BoardId: $BoardId
            title: $title
            author: $author
            content: $content
            sort: $sort
            isMatched: $isMatched
            limit: $limit
            lastKey: $lastKey
            createdAt: $createdAt
            like: $like
        ) {
            _id
            title
            content
            author
            createdAt
            updatedAt
            like
            label
        }
    }
`;

export const PAGINATION_QUERY = gql`
    query(
        $BoardId: ID!
        $title: String
        $author: String
        $content: String
        $sort: sortingTypes
        $isMatched: Boolean
        $limit: Int
        $page: Int
    ) {
        getPagenationBoards(
            BoardId: $BoardId
            title: $title
            author: $author
            content: $content
            sort: $sort
            isMatched: $isMatched
            limit: $limit
            page: $page
        ) {
            _id
            title
            content
            author
            createdAt
            updatedAt
            like
            label
        }
    }
`;

export const SEARCH_COUNT = gql`
    query($title: String, $author: String, $content: String, $isMatched: Boolean, $BoardId: ID!) {
        getSearchCount(
            title: $title
            author: $author
            content: $content
            isMatched: $isMatched
            BoardId: $BoardId
        ) {
            count
        }
    }
`;
