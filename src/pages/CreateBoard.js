import React, { useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';

const BOARD_MUTATION = gql`
    mutation addBoard($title: String!, $author: String!, $content: String!){
        addBoard(title: $title, author: $author, content: $content){
            title
            author
            content
        }
    }
`

const CreateBoard = ({history}) => {

    const [addBoard] = useMutation(BOARD_MUTATION);
    const [state, setState] = useState({
        title: '',
        author: '',
        content: ''
    });

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const buttonClick = (e) => {
        e.preventDefault();
        addBoard({ variables: { title: state.title, author: state.author, content: state.content } });
        history.push('/');
    }

    return (
        <div className="m-3 p-5">
            <Form>
                <Form.Row>
                    <Col sm={8}><Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>제목</Form.Label>
                        <Form.Control name="title" type="text" placeholder="제목" onChange={handleChange} />
                    </Form.Group>
                    </Col>
                    <Col sm={4}><Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>작성자</Form.Label>
                        <Form.Control name="author" type="text" placeholder="이름" onChange={handleChange} />
                    </Form.Group>
                    </Col>
                </Form.Row>

                <Col>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>내용</Form.Label>
                        <Form.Control as="textarea" rows={5} name="content" onChange={handleChange} />
                    </Form.Group>
                </Col>

                <Col>
                    <Button variant="primary" onClick={buttonClick}>Submit</Button>
                </Col>
            </Form>
        </div>
    )
}

export default withRouter(CreateBoard);