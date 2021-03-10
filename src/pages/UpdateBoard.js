import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Form, Col, Button } from 'react-bootstrap';
import { BOARD_QUERY, BOARD_DELETE, BOARD_UPDATE, ADD_LIKE, ADD_DISLIKE } from '../gql/mutation';
import { HandThumbsUpFill, HandThumbsDownFill } from 'react-bootstrap-icons';
import Select from 'react-select';
import { withRouter } from 'react-router-dom';

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

const UpdateBoard = ({ match, location, history }) => {
    const { userid } = match.params;
    const [state, setState] = useState({
        title: '',
        content: '',
        label: [],
        likeCount: 0,
    });

    const [like, setLike] = useState({
        likeClick: false,
        dislikeClick: false,
    });

    const { loading, error, data } = useQuery(BOARD_QUERY, {
        variables: { _id: userid },
    });

    useEffect(() => {
        if (data) {
            const userData = data.getBoard;
            setState({
                title: userData.title,
                content: userData.content,
                label: userData.label,
                likeCount: userData.like,
            });
        }
        return () => {
            setState({ title: '', content: '', label: [], likeCount: 0 });
        };
    }, [data]);

    const [updateBoard] = useMutation(BOARD_UPDATE, {
        refetchQueries: [
            {
                query: BOARD_QUERY,
                variables: {
                    _id: userid,
                },
            },
        ],
        onCompleted() {
            console.log('onCompleted');

            // window.location.href = '/';
            history.push('/');
        },
    });
    const [deleteBoard] = useMutation(BOARD_DELETE, {
        refetchQueries: [
            {
                query: BOARD_QUERY,
                variables: {
                    _id: userid,
                },
            },
        ],
        onCompleted() {
            // history.push('/');
            window.location.href = '/';
        },
    });
    const [addLike] = useMutation(ADD_LIKE, {
        refetchQueries: [
            {
                query: BOARD_QUERY,
                variables: {
                    _id: userid,
                },
            },
        ],
        onCompleted() {
            console.log('onCompleted');
        },
    });
    const [addDislike] = useMutation(ADD_DISLIKE, {
        refetchQueries: [
            {
                query: BOARD_QUERY,
                variables: {
                    _id: userid,
                },
            },
        ],
        onCompleted() {
            console.log('onCompleted');
        },
    });

    const HandleChange = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const UpdateClick = e => {
        e.preventDefault();
        updateBoard({
            variables: {
                _id: userid,
                title: state.title,
                content: state.content,
                label: state.label,
            },
        });
        //history.push('/'); //해당 코드에서 문제가 발생한 것으로 보임. 해결하기 위해선 useEffect를 써야할지도,,
    };

    const DeleteClick = e => {
        e.preventDefault();
        deleteBoard({ variables: { _id: userid } });
        //history.push('/'); //해당 코드에서 문제가 발생한 것으로 보임. 해결하기 위해선 useEffect를 써야할지도,,
    };

    const LikeClick = e => {
        if (!like.likeClick) {
            e.preventDefault();
            setLike({
                ...like,
                likeClick: true,
            });
            addLike({ variables: { _id: userid } });
            alert('좋아요를 누르셨습니다.');
        }
    };

    const DislikeClick = e => {
        if (!like.dislikeClick) {
            e.preventDefault();
            setLike({
                ...like,
                dislikeClick: true,
            });
            if (state.likeCount > 0) addDislike({ variables: { _id: userid } });
            alert('싫어요를 누르셨습니다.');
        }
    };

    const LabelChange = value => {
        let labelList = [];
        Object.values(value).forEach(key => labelList.push(key.value));
        setState({
            ...state,
            label: labelList,
        });
        // console.log(labelList);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    let defaultLabels = [];
    state.label.forEach(key => defaultLabels.push({ value: key, label: key.replace(' ', '_') }));

    return (
        <div className="m-3 p-5">
            <Form>
                <Form.Row>
                    <Col sm={8}>
                        <Form.Group as={Col} controlId="formGridTitle">
                            <Form.Label>제목</Form.Label>
                            <Form.Control
                                name="title"
                                type="text"
                                defaultValue={state.title}
                                placeholder="제목"
                                onChange={HandleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={4}>
                        <Form.Group as={Col} controlId="formGridAuthor">
                            <Form.Label>작성자</Form.Label>
                            <Form.Control
                                readOnly
                                name="author"
                                defaultValue={state.author}
                                type="text"
                                placeholder="이름"
                                onChange={HandleChange}
                            />
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col sm={8}>
                        <Form.Group as={Col} controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Label</Form.Label>
                            <Select
                                value={defaultLabels}
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
                    <Col sm={4}>
                        <Form.Group as={Col}>
                            <Form.Label style={{ display: 'flex', justifyContent: 'right' }}>
                                {state.likeCount} 개의 Like
                            </Form.Label>
                            <div>
                                <Button
                                    className="mr-1"
                                    variant="outline-success"
                                    onClick={LikeClick}
                                    active={like.likeClick}
                                    disabled={like.dislikeClick}
                                >
                                    <HandThumbsUpFill />
                                    &nbsp;&nbsp;Like
                                </Button>
                                <Button
                                    className="mr-1"
                                    variant="outline-danger"
                                    onClick={DislikeClick}
                                    active={like.dislikeClick}
                                    disabled={like.likeClick}
                                >
                                    <HandThumbsDownFill />
                                    &nbsp;&nbsp;Dislike
                                </Button>
                            </div>
                        </Form.Group>
                    </Col>
                </Form.Row>

                <Col>
                    <Form.Group controlId="ControlContent">
                        <Form.Label>내용</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={6}
                            name="content"
                            defaultValue={state.content}
                            onChange={HandleChange}
                        />
                    </Form.Group>
                </Col>

                <Col>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Button className="mr-1" variant="primary" onClick={UpdateClick}>
                                수정
                            </Button>
                            <Button className="mr-1" variant="danger" onClick={DeleteClick}>
                                삭제
                            </Button>
                        </div>

                        <div>
                            <div style={{ justifyContent: 'flex-end' }}>
                                <Button
                                    className="mr-1"
                                    variant="info"
                                    onClick={() => {
                                        //refetch({ _id: userid });
                                        window.location.href = '/';
                                        // history.replace('/');
                                    }}
                                >
                                    홈으로
                                </Button>
                            </div>
                        </div>
                    </div>
                </Col>
            </Form>
        </div>
    );
};

export default withRouter(UpdateBoard);
