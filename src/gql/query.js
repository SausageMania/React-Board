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
    query($title: String, $author: String, $content: String) {
        searchBoards(title: $title, author: $author, content: $content) {
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
    query($title: String, $author: String, $content: String) {
        getSearchCount(title: $title, author: $author, content: $content) {
            count
        }
    }
`;
