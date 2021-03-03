import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Table, Button, Form, Pagination } from 'react-bootstrap';
import { Route, Link, useHistory } from 'react-router-dom';
import CreateBoard from './CreateBoard';
import qs from 'qs';

const BOARDS_QUERY = gql`
query($sort:sortingTypes,$page:Int){
    getBoards(sort:$sort, page: $page, limit:5){
        _id
        title
        content
        author
        createdAt
        updatedAt
        seq
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
        like
    }
}
`

const TOTAL_COUNT = gql`
{
    getBoardsCount{
        count
    }
}
`

const SEARCH_COUNT = gql`
query($title:String, $author:String, $content:String){
    getSearchCount(title:$title, author:$author, content:$content){
        count
    }
}
`

const BoardList = ({ location, history }) => {
    const [state, setState] = useState({
        select: 'title',
        search: '',
        active: 1,
        sort: 'recent'
    });

    //검색버튼을 누르면 parameter로 'select'와 'search'를 넘겨줌.
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    const doSearch = (params.search !== '' && params.search != null) ? true : false;

    const totalQuery = useQuery(BOARDS_QUERY, { skip: doSearch });  //검색을 하지 않을 때
    const searchQuery = useQuery(SEARCH_QUERY, { variables: { [params.select]: params.search }, skip: !doSearch });    //검색을 할 때
    const totalCount = useQuery(TOTAL_COUNT, {skip:doSearch});
    const searchCount = useQuery(SEARCH_COUNT, {variables: { [params.select]: params.search }, skip:!doSearch});
    
    
    //const [searchClick, {data, loading}] = useLazyQuery(SEARCH_QUERY, {variables:{[state.select]:state.search} });

    const loading = doSearch ? searchQuery.loading : totalQuery.loading;
    const error = doSearch ? searchQuery.error : totalQuery.error;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    const SortClick = (e) => {  //정렬을 위해 테이블을 클릭할 경우
        const sortValue = e.target.name;
        setState({
            ...state,
            sort: sortValue
        })
        if (doSearch)
            searchQuery.refetch({ sort: sortValue, page: state.active });
        else
            totalQuery.refetch({ sort: sortValue, page: state.active });
    }

    const HandleChange = (e) => { //검색란에 값을 칠 경우
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    const SearchClick = () => { //검색 버튼을 누를 경우
        window.location.href = '?select=' + state.select + '&search=' + state.search;
        //history.push('?select=' + state.select + '&search=' + state.search);
    }

    const data = doSearch ? searchQuery.data.searchBoards : totalQuery.data.getBoards;

    const list = data.map(
        (board, index) => <Board key={board._id} seq={index} info={board} />
    );

    const PageInto = (e) => {
        const page = parseInt(e.target.name);
        setState({
            ...state,
            active: page
        });

        if(doSearch)
            searchQuery.refetch({page:page});
        else
            totalQuery.refetch({page:page});
    }


    const Pages = (e) => {
        const {loading:pageLoading, error:pageError, data:pageData} = doSearch ? searchCount : totalCount;

        if(pageLoading) return <p>loading...</p>
        if(pageError) return <p>error</p>

        const dataCount = doSearch ? pageData.getSearchCount.count : pageData.getBoardsCount.count;
        const pageNum = (dataCount % 5 === 0) ? (dataCount / 5) : dataCount / 5 + 1;
        let items = [];

        for (let number = 1; number <= pageNum; number++) {
            items.push(
                <Pagination.Item key={number} name={number} active={number === parseInt(state.active)} onClick={PageInto}>
                    {number}
                </Pagination.Item>
            )
        }
        return (
            <Pagination>
                <Pagination.First name={1} onClick={PageInto} />
                <Pagination.Prev />
                {items}
                <Pagination.Next />
                <Pagination.Last name={pageNum} onClick={PageInto}/>
            </Pagination>
        );
        
    }


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
                            <th onClick={SortClick} name="seq" >No.</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th onClick={SortClick} name="recent" >생성날짜</th>
                            <th>수정날짜</th>
                            <th onClick={SortClick} name="like" >Like</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list}
                    </tbody>
                </Table>
            </div>

            <div style={{ display: "inline" }}>
                <div className="d-flex"><Pages /></div>
                <div style={{ textAlign: "right" }}>
                    <Link to="/create">
                        <Button variant="info">게시글 생성</Button>
                    </Link>
                </div>
            </div>
            <Route path="/create" component={CreateBoard} />
        </div>
    );

}


const Board = (props) => {
    const { _id, title, author, createdAt, updatedAt, like, seq } = props.info;

    const history = useHistory();

    const handleClick = () => {
        history.push(`/board/${_id}`);
    }

    return (
        <tr onClick={handleClick}>
            <td>{seq}</td>
            <td>{title}</td>
            <td>{author}</td>
            <td>{createdAt}</td>
            <td>{updatedAt}</td>
            <td>{like}</td>
        </tr>
    );
}





export default BoardList;