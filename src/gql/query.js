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
        $title: String
        $author: String
        $content: String
        $page: Int
        $sort: sortingTypes
        $isMatched: Boolean
    ) {
        searchBoards(
            title: $title
            author: $author
            content: $content
            page: $page
            sort: $sort
            isMatched: $isMatched
        ) {
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

export const TOTAL_COUNT = gql`
    {
        getBoardsCount {
            count
        }
    }
`;

export const SEARCH_COUNT = gql`
    query($title: String, $author: String, $content: String, $isMatched: Boolean) {
        getSearchCount(title: $title, author: $author, content: $content, isMatched: $isMatched) {
            count
        }
    }
`;
