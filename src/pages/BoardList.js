import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Table, Button, Form } from 'react-bootstrap';
import { Route, Link, useHistory } from 'react-router-dom';
import CreateBoard from './CreateBoard';
import qs from 'qs';

const BOARDS_QUERY = gql`
query($sort:sortingTypes){
    getBoards(sort:$sort){
        _id
        title
        content
        author
        createdAt
        updatedAt
        like
    }
}
`
const SEARCH_QUERY = gql`
query($title:String, $author:String, $content:String){
    searchBoards(title:$title, author:$author, content:$content){
        _id
        title
        content
        author
        createdAt
        updatedAt
        seq
    }
}
`

const BoardList = ({ location, history }) => {
    const [state, setState] = useState({
        select: 'title',
        search: ''
    });

    //검색버튼을 누르면 parameter로 'select'와 'search'를 넘겨줌.
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    const doSearch = (params.search !== '' && params.search != null) ? true : false;

    const totalQuery = useQuery(BOARDS_QUERY, { skip: doSearch });  //검색을 하지 않을 때
    const searchQuery = useQuery(SEARCH_QUERY, { variables: { [params.select]: params.search }, skip: !doSearch });    //검색을 할 때
    //const [searchClick, {data, loading}] = useLazyQuery(SEARCH_QUERY, {variables:{[state.select]:state.search} });

    const loading = doSearch ? searchQuery.loading : totalQuery.loading;
    const error = doSearch ? searchQuery.error : totalQuery.error;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    const SortClick = (e) => {
        totalQuery.fetchMore({
            variables: {
                //sort: 
            }
        })
    }

    const HandleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    const SearchClick = () => {
        history.push('?select=' + state.select + '&search=' + state.search);
    }

    const data = doSearch ? searchQuery.data.searchBoards : totalQuery.data.getBoards;

    const list = data.map(
        (board, index) => <Board key={board._id} seq={index} info={board} />
    );

    return (
        <div className="m-3 p-5">
            <div>
                <h1 style={{ textAlign: "center" }}>CRUD 게시판</h1>
                <Form style={{ float: "right" }} inline>
                    <Form.Control name="select" onChange={HandleChange} as="select" custom className="mr-1">
                        <option value="title">제목</option>
                        <option value="author">작성자</option>
                        <option value="content">내용</option>
                    </Form.Control>
                    <Form.Control type="text" name="search" onChange={HandleChange} placeholder="검색" className="mr-1" />
                    <Button variant="outline-success" onClick={SearchClick}>검색</Button>
                </Form>
            </div>
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>생성날짜</th>
                            <th>수정날짜</th>
                            <th onClick={SortClick}>Like</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list}
                    </tbody>
                </Table>
            </div>

            <div>
                <Link to="/create">
                    <Button variant="info">게시글 생성</Button>
                </Link>
            </div>
            <Route path="/create" component={CreateBoard} />
        </div>
    );

}


const Board = (props) => {
    const { _id, title, author, createdAt, updatedAt, like } = props.info;



    const history = useHistory();

    const handleClick = () => {
        history.push(`/board/${_id}`);
    }

    return (
        <tr onClick={handleClick}>
            <td>{props.seq + 1}</td>
            <td>{title}</td>
            <td>{author}</td>
            <td>{createdAt}</td>
            <td>{updatedAt}</td>
            <td>{like}</td>
        </tr>
    );
}





export default BoardList;