import gql from 'graphql-tag';

export const BOARD_QUERY = gql`
query($_id: ID!){
    getBoard(_id: $_id){
        title
        content
        author
        like
    }
}
`

export const BOARD_CREATE = gql`
    mutation addBoard($title: String!, $author: String!, $content: String!){
        addBoard(title: $title, author: $author, content: $content){
            title
            author
            content
        }
    }
`

export const BOARD_UPDATE = gql`
    mutation updateBoard($_id: ID!, $title: String, $content: String){
        updateBoard(_id: $_id, title: $title, content: $content){
            _id
            title
            content
        }
    }
`

export const BOARD_DELETE = gql`
    mutation deleteBoard($_id:ID){
        deleteBoard(_id:$_id){
            _id
        }
    }
`

export const ADD_LIKE = gql`
    mutation addLike($_id: ID!){
        addLike(_id:$_id){
            _id
        }
    }

`

export const ADD_DISLIKE = gql`
    mutation addDislike($_id:ID!){
        addDislike(_id:$_id){
            _id
        }
    }

`