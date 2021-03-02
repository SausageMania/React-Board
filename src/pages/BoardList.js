import React, {useEffect} from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Table, Button, Form } from 'react-bootstrap';
import { Route, Link, useHistory } from 'react-router-dom';
import CreateBoard from './CreateBoard';

const BOARDS_QUERY = gql`
{
    boards{
        _id
        title
        content
        author
        createdAt
        updatedAt
    }
}
`
const BoardList = (props) => {

    const { loading, error, data } = useQuery(BOARDS_QUERY);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    const list = data.boards.map(
        board => <Board key={board._id} info={board} />
    );

    const style = {
        textAlign: "center"
    }

    
    return (
        <div className="m-3 p-5">
            <div>
                <h1 style={style}>게시글 CRUD</h1>
                <Form inline>
                    <Form.Control as="select" custom>
                        <option>제목</option>
                        <option>작성자</option>
                        <option>내용</option>
                    </Form.Control>
                    <Form.Control type="text" placeholder="검색" className="">
                        <Button variant="outline-success">검색</Button>
                    </Form.Control>
                </Form>
            </div>
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr >
                            <th>No.</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>생성날짜</th>
                            <th>수정날짜</th>
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
    const {_id, title, author, createdAt, updatedAt} = props.info;
    const history = useHistory();

    const handleClick = () => {
        history.push(`/board/${_id}`);
    }

    return (
        <tr onClick={handleClick}>
            <td>{_id + 1}</td>
            <td>{title}</td>
            <td>{author}</td>
            <td>{createdAt}</td>
            <td>{updatedAt}</td>
        </tr>
    );
}





export default BoardList;