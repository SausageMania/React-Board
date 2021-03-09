import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Table, Button, Form, Pagination, Badge, InputGroup } from 'react-bootstrap';
import { Route, Link, useHistory } from 'react-router-dom';
import CreateBoard from './CreateBoard';
import { SEARCH_QUERY, SEARCH_COUNT } from '../gql/query';
import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
//import { CaretDownFill } from 'react-bootstrap-icons';

const BoardList = () => {
    const [state, setState] = useState({
        title: '',
        author: '',
        content: '',
    });
    const [active, setActive] = useState(1);
    const [select, setSelect] = useState({
        title: false,
        author: false,
        content: false,
        match: false,
    });

    const [search, setSearch] = useState({
        state,
        select,
    });

    const searchCount = useQuery(SEARCH_COUNT, {
        variables: {
            title: search.select.title ? search.state.title : null,
            author: search.select.author ? search.state.author : null,
            content: search.select.content ? search.state.content : null,
            isMatched: search.select.match,
        },
    }); //검색필터링 된 게시글 갯수(검색하지 않을 시 전체 갯수)

    //const [searchClick, {data, loading}] = useLazyQuery(SEARCH_QUERY, {variables:{[state.select]:state.search} });

    const HandleChange = e => {
        //검색란에 값을 칠 경우
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const SelectClick = e => {
        setSelect({
            ...select,
            [e.target.name]: select[e.target.name] ? false : true,
        });
    };

    const SearchClick = () => {
        setSearch({
            state,
            active,
            select,
        });
        //검색 버튼을 누를 경우
    };

    const PageInto = number => {
        const page = number;
        setActive(page);
    };

    const Pages = () => {
        const limit = 5;
        const { loading: pageLoading, error: pageError, data: pageData } = searchCount;

        if (pageLoading) return <p>Pagination loading...</p>;
        if (pageError) return <p>Pagination error</p>;

        const dataCount = pageData.getSearchCount.count;
        const pageNum =
            dataCount % limit === 0 ? parseInt(dataCount / limit) : parseInt(dataCount / limit) + 1;
        let items = [];

        for (let number = 1; number <= pageNum; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    name={number}
                    active={number === parseInt(active)}
                    onClick={() => PageInto(number)}
                >
                    {number}
                </Pagination.Item>,
            );
        }
        return (
            <Pagination>
                <Pagination.First onClick={() => PageInto(1)} />
                {items}
                <Pagination.Last onClick={() => PageInto(pageNum)} />
            </Pagination>
        );
    };

    return (
        <div className="m-3 p-5">
            <div>
                <h1 style={{ textAlign: 'center' }}>CRUD 게시판</h1>
                <br />
                <Form
                    className="mb-1"
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                    inline
                >
                    <InputGroup className="mr-1" style={{ width: '28%' }}>
                        <InputGroup.Prepend size="sm">
                            <Button
                                variant="outline-secondary"
                                onClick={SelectClick}
                                active={select.title}
                                name="title"
                            >
                                제목
                            </Button>
                        </InputGroup.Prepend>
                        <Form.Control
                            aria-describedby="basic-addon1"
                            placeholder="제목을 입력하세요."
                            defaultValue={state.select}
                            name="title"
                            onChange={HandleChange}
                        />
                    </InputGroup>
                    <InputGroup className="mr-1" style={{ width: '28%' }}>
                        <InputGroup.Prepend>
                            <Button
                                variant="outline-secondary"
                                onClick={SelectClick}
                                active={select.author}
                                name="author"
                            >
                                작성자
                            </Button>
                        </InputGroup.Prepend>
                        <Form.Control
                            aria-describedby="basic-addon1"
                            placeholder="작성자를 입력하세요."
                            name="author"
                            onChange={HandleChange}
                        />
                    </InputGroup>
                    <InputGroup className="mr-1" style={{ width: '28%' }}>
                        <InputGroup.Prepend>
                            <Button
                                variant="outline-secondary"
                                onClick={SelectClick}
                                active={select.content}
                                name="content"
                            >
                                내용
                            </Button>
                        </InputGroup.Prepend>
                        <Form.Control
                            aria-describedby="basic-addon1"
                            placeholder="내용을 입력하세요."
                            name="content"
                            onChange={HandleChange}
                        />
                    </InputGroup>
                    <Button
                        variant="outline-danger"
                        active={select.match}
                        name="match"
                        onClick={SelectClick}
                    >
                        매치
                    </Button>
                    <Button variant="outline-success" onClick={SearchClick}>
                        검색
                    </Button>
                </Form>
            </div>
            <ShowList info={{ active, search }} />

            <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Pages />
                </div>
                <div style={{ float: 'right' }}>
                    <Link to="/create">
                        <Button variant="info">게시글 생성</Button>
                    </Link>
                </div>
            </div>
            <Route path="/create" component={CreateBoard} />
        </div>
    );
};

const ShowList = props => {
    const { active, search } = props.info;
    const [sort, setState] = useState('recent');

    const searchQuery = useQuery(SEARCH_QUERY, {
        variables: {
            title: search.select.title ? search.state.title : null,
            author: search.select.author ? search.state.author : null,
            content: search.select.content ? search.state.content : null,
            isMatched: search.select.match,
            page: active,
            sort: sort,
        },
    }); //검색필터링된 게시글(검색하지 않을 시 전체 데이터)

    const { loading, error, data } = searchQuery;

    if (loading) return <p>Board loading...</p>;
    if (error) return <p>Board error</p>;

    const realData = data.searchBoards;
    const list = realData.map((board, index) => <Board key={board._id} seq={index} info={board} />);
    const SortClick = e => {
        //정렬 을 위해 테이블을 클릭할 경우
        const sortValue = e.target.id;
        setState(sortValue);
    };
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th onClick={SortClick} id="seq">
                            No.
                        </th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th onClick={SortClick} id="recent">
                            생성날짜
                        </th>
                        <th>수정날짜</th>
                        <th onClick={SortClick} id="like">
                            Like
                        </th>
                    </tr>
                </thead>
                <tbody>{list}</tbody>
            </Table>
        </div>
    );
};

const Board = props => {
    const { _id, title, author, createdAt, updatedAt, like, seq, label } = props.info;
    const labelList = label.map((data, index) => {
        switch (data) {
            case 'help_wanted':
                return (
                    <Badge key={index} variant="primary" className="mr-1">
                        help wanted
                    </Badge>
                );
            case 'bug':
                return (
                    <Badge key={index} variant="danger" className="mr-1">
                        bug
                    </Badge>
                );
            case 'documention':
                return (
                    <Badge key={index} variant="secondary" className="mr-1">
                        documention
                    </Badge>
                );
            case 'enhancement':
                return (
                    <Badge key={index} variant="success" className="mr-1">
                        enhancement
                    </Badge>
                );
            case 'duplicate':
                return (
                    <Badge key={index} variant="warning" className="mr-1">
                        duplicated
                    </Badge>
                );
            case 'question':
                return (
                    <Badge key={index} variant="dark" className="mr-1">
                        question
                    </Badge>
                );
            case 'good_first_issue':
                return (
                    <Badge key={index} variant="light" className="mr-1">
                        good first issue
                    </Badge>
                );
            default:
                return <p>nothing..</p>;
        }
    });

    const history = useHistory();

    const handleClick = () => {
        // window.location.href('/');
        // window.location.href(`/board/${_id}`);
        history.push(`/board/${_id}`);
    };
    return (
        <tr onClick={handleClick}>
            <td>{seq}</td>
            <td>
                {title}
                <p></p>
                {labelList}
            </td>
            <td>{author}</td>
            <td>{dayjs(createdAt).format('YYYY-MM-DD HH:mm')}</td>
            <td>
                {dayjs(updatedAt).format('YYYY-MM-DD HH:mm')}
                <UpdateFromNow data={updatedAt} />
            </td>
            <td>{like}</td>
        </tr>
    );
};

const UpdateFromNow = props => {
    dayjs.extend(relativeTime);
    const howMuch = dayjs(props.data.split('Z')[0]).fromNow();
    //const howMuch = dayjs(dayjs()).diff(props.data, 'seconds');

    return (
        <p>
            <b> [{howMuch}]</b>
        </p>
    );
};

export default BoardList;
