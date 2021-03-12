import React, { useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { useMutation } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import { BOARD_CREATE } from '../gql/mutation';
import Select from 'react-select';

const options = [
    { value: 'bug', label: 'bug' },
    { value: 'documention', label: 'documention' },
    { value: 'enhancement', label: 'enhancement' },
    { value: 'duplicate', label: 'duplicate' },
    { value: 'help_wanted', label: 'help wanted' },
    { value: 'question', label: 'question' },
    { value: 'good_first_issue', label: 'good first issue' },
    { value: 'enhancement', label: 'enhancement' },
];

const CreateBoard = ({ history }) => {
    const [addBoard] = useMutation(BOARD_CREATE, {
        onCompleted() {
            alert('게시글이 생성되었습니다.');
            // history.push('/');
            window.location.href = '/';
        },
    });
    const [state, setState] = useState({
        title: '',
        author: '',
        content: '',
        label: [],
    });

    const handleChange = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const buttonClick = e => {
        e.preventDefault();
        addBoard({
            variables: {
                title: state.title,
                author: state.author,
                content: state.content,
                label: state.label,
                BoardId: 'Board1',
            },
        });
        console.log(state.label);
        //history.push('/');
    };

    const LabelChange = value => {
        let labelList = [];
        Object.values(value).forEach(key => labelList.push(key.value));
        setState({
            ...state,
            label: labelList,
        });
    };

    return (
        <div className="m-3 p-5">
            <Form>
                <Form.Row>
                    <Col sm={8}>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>제목</Form.Label>
                            <Form.Control
                                name="title"
                                type="text"
                                placeholder="제목"
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={4}>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>작성자</Form.Label>
                            <Form.Control
                                name="author"
                                type="text"
                                placeholder="이름"
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Col sm={6}>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Label</Form.Label>
                        <Select
                            onChange={value => LabelChange(value)}
                            closeMenuOnSelect={false}
                            isMulti={true}
                            options={options}
                            styles={{
                                multiValue: base => ({
                                    ...base,
                                    backgroundColor: '#339af0',
                                }),
                                multiValueLabel: base => ({
                                    ...base,
                                    backgroundColor: '#339af0',
                                    color: 'white',
                                }),
                                multiValueRemove: base => ({
                                    ...base,
                                    backgroundColor: '#339af0',
                                    color: 'white',
                                }),
                            }}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>내용</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            name="content"
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>

                <Col>
                    <Button variant="primary" onClick={buttonClick}>
                        Submit
                    </Button>
                </Col>
            </Form>
        </div>
    );
};

export default withRouter(CreateBoard);
