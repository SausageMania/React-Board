import React, { useState } from 'react';
import qs from 'qs';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Form, Col, Button } from 'react-bootstrap';


const BOARD_QUERY = gql`
query($id: Int!){
    board(id: $id){
        title
        content
        author
    }
}
`

const BOARD_UPDATE = gql`
    mutation updateBoard($id: Int!, $title: String, $content: String){
        updateBoard(id: $id, title: $title, content: $content){
            id
            title
            content
        }
    }
`

const BOARD_DELETE = gql`
    mutation deleteBoard($id:Int){
        deleteBoard(id:$id){
            id
        }
    }
`

const UpdateBoard = ({ match, location, history }) => {
    const { userid } = match.params;
    const [updateBoard] = useMutation(BOARD_UPDATE);
    const [deleteBoard] = useMutation(BOARD_DELETE);

    const [state, setState] = useState({
    });

    const HandleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const UpdateClick = (e) => {
        e.preventDefault();
        updateBoard({ variables: { id: parseInt(userid), title: state.title, content: state.content } });
        history.push('/');
    }

    const DeleteClick = (e) => {
        e.preventDefault();
        deleteBoard({variables: {id:parseInt(userid)} });
        history.push('/');
    }

    const { loading, error, data } = useQuery(BOARD_QUERY, {variables: {id: parseInt(userid)}});
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    const userData = data.board;

    return (
        <div className="m-3 p-5">
            <Form>
                <Form.Row>
                    <Col sm={8}><Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>제목</Form.Label>
                        <Form.Control name="title" type="text" defaultValue = {userData.title} placeholder="제목" onChange={HandleChange}/>
                    </Form.Group>
                    </Col>
                    <Col sm={4}><Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>작성자</Form.Label>
                        <Form.Control readOnly name="author" defaultValue={userData.author} type="text" placeholder="이름" onChange={HandleChange} />
                    </Form.Group>
                    </Col>
                </Form.Row>

                <Col>
                    <Form.Group controlId="ControlTextarea1">
                        <Form.Label>내용</Form.Label>
                        <Form.Control as="textarea" rows={5} defaultValue={userData.content} name="content" onChange={HandleChange}/>
                    </Form.Group>
                </Col>

                <Col>
                    <Button className="mr-1" variant="primary" onClick={UpdateClick}>수정</Button>
                    <Button className="mr-1" variant="danger" onClick={DeleteClick}>삭제</Button>
                </Col>
            </Form>
        </div>
    )
}

export default UpdateBoard;