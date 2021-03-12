import gql from 'graphql-tag';

export const BOARDS_QUERY = gql`
    query($sort: sortingTypes, $page: Int) {
        getBoards(sort: $sort, page: $page) {
            _id
            title
            content
            author
            createdAt
            updatedAt
            seq
            like
            label
        }
    }
`;
export const SEARCH_QUERY = gql`
    query(
        $BoardId: ID!
        $title: String
        $author: String
        $content: String
        $sort: sortingTypes
        $isMatched: Boolean
        $lastKey: String
    ) {
        searchBoards(
            BoardId: $BoardId
            title: $title
            author: $author
            content: $content
            sort: $sort
            isMatched: $isMatched
            lastKey: $lastKey
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

export const TOTAL_COUNT = gql`
    {
        getBoardsCount {
            count
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
