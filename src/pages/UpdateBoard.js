import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Form, Col, Button } from 'react-bootstrap';
import { BOARD_QUERY, BOARD_DELETE, BOARD_UPDATE, ADD_LIKE, ADD_DISLIKE } from '../gql/mutation'
import { HandThumbsUpFill, HandThumbsDownFill } from 'react-bootstrap-icons';

const UpdateBoard = ({ match, location, history }) => {
    const { userid } = match.params;
    const [updateBoard] = useMutation(BOARD_UPDATE, {
        onCompleted() {
            window.location.href = '/';
            //history.push('/');
        }
    });
    const [deleteBoard] = useMutation(BOARD_DELETE, {
        onCompleted() {
            window.location.href = '/';
            //history.push('/');
        }
    });
    const [addLike] = useMutation(ADD_LIKE, {
        onCompleted() {
            alert("좋아요를 누르셨습니다.");
            refetch({id:userid});
        }
    });
    const [addDislike] = useMutation(ADD_DISLIKE, {
        onCompleted() {
            alert("싫어요를 누르셨습니다.");
            refetch({id:userid});
        }
    });


    const [state, setState] = useState({
        likeClick: false,
        dislikeClick: false
    });

    const { loading, error, data, refetch } = useQuery(BOARD_QUERY, { variables: { _id: userid } });

    const HandleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const UpdateClick = (e) => {
        e.preventDefault();
        updateBoard({ variables: { _id: userid, title: state.title, content: state.content } });
        //history.push('/'); //해당 코드에서 문제가 발생한 것으로 보임. 해결하기 위해선 useEffect를 써야할지도,,
    }

    const DeleteClick = (e) => {
        e.preventDefault();
        deleteBoard({ variables: { _id: userid } });
        //history.push('/'); //해당 코드에서 문제가 발생한 것으로 보임. 해결하기 위해선 useEffect를 써야할지도,,
    }

    const LikeClick = (e) => {
        if(!state.likeClick){
            e.preventDefault();
            setState({
                ...state,
                likeClick: true,
            });
            addLike({ variables: { _id: userid } });
            
        }
    }

    const DislikeClick = (e) => {
        if (!state.dislikeClick) {
            e.preventDefault();
            setState({
                ...state,
                dislikeClick: true
            });
            if(userData.like > 0)
                addDislike({ variables: { _id: userid } });
            refetch();

        }

    }


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    const userData = data.getBoard;

    return (
        <div className="m-3 p-5">
            <Form>
                <Form.Row>
                    <Col sm={8}><Form.Group as={Col} controlId="formGridTitle">
                        <Form.Label>제목</Form.Label>
                        <Form.Control name="title" type="text" defaultValue={userData.title} placeholder="제목" onChange={HandleChange} />
                    </Form.Group>
                    </Col>
                    <Col sm={4}><Form.Group as={Col} controlId="formGridAuthor">
                        <Form.Label>작성자</Form.Label>
                        <Form.Control readOnly name="author" defaultValue={userData.author} type="text" placeholder="이름" onChange={HandleChange} />
                    </Form.Group>
                    </Col>
                </Form.Row>

                <Col>
                    <Form.Group controlId="ControlContent">
                        <Form.Label>내용</Form.Label>
                        <Form.Control as="textarea" rows={5} name="content" defaultValue={userData.content} onChange={HandleChange} />
                    </Form.Group>
                </Col>

                <Col>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                        <div>
                            <Button className="mr-1" variant="primary" onClick={UpdateClick}>수정</Button>
                            <Button className="mr-1" variant="danger" onClick={DeleteClick}>삭제</Button>
                        </div>

                        <div>
                            <div style={{justifyContent:"flex-end"}}>{userData.like} 개의 Like</div>
                            
                            <Button className="mr-1"  variant="outline-success"
                                onClick={LikeClick} active={state.likeClick} disabled={state.dislikeClick}>
                                    <HandThumbsUpFill />
                                    &nbsp;&nbsp;Like
                            </Button>
                            <Button className="mr-1" variant="outline-danger"
                                onClick={DislikeClick} active={state.dislikeClick} disabled={state.likeClick}>
                                <HandThumbsDownFill />
                                &nbsp;&nbsp;Dislike
                            </Button>
                        </div>
                    </div>

                    
                </Col>
            </Form>
        </div>
    )
}

export default UpdateBoard;