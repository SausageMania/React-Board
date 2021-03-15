import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Table, Button, Form, Badge, InputGroup } from 'react-bootstrap';
import { Route, Link, useHistory } from 'react-router-dom';
import CreateBoard from './CreateBoard';
import { SCROLL_QUERY, SEARCH_COUNT } from '../gql/query';
import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { withRouter } from 'react-router-dom';

import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons';

const BoardList_Scroll = () => {
    const [state, setState] = useState({
        title: '',
        author: '',
        content: '',
    });
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

    const [searchSwitch, setSearchSwitch] = useState(false);

    const [update, setUpdate] = useState(false);

    const [end, setEnd] = useState(false);

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
        setSearchSwitch(true);
        setSearch({
            state,
            select,
        });
        //검색 버튼을 누를 경우
    };

    // const scrollRef = useRef();
    useEffect(() => {
        if (update) {
            // scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            setUpdate(false);
        }
    }, [update]);

    return (
        <div className="m-3 p-5" style={{ overflow: 'auto' }}>
            <div>
                <h1 style={{ textAlign: 'center' }}>CRUD 게시판</h1>

                <div className="mb-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to="/pagination">
                        <Button className="mr-2" variant="warning">
                            Pagination 기반
                        </Button>
                    </Link>
                    <Link to="/create">
                        <Button variant="info">게시글 생성</Button>
                    </Link>
                </div>
            </div>

            <div>
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
            <div>
                <ShowList
                    searchSwitch={searchSwitch}
                    setSearchSwitch={setSearchSwitch}
                    end={end}
                    setEnd={setEnd}
                    info={search}
                    setUpdate={setUpdate}
                />
            </div>

            <Route path="/create" component={CreateBoard} />
        </div>
    );
};

const ShowList = props => {
    const search = props.info;
    const [sort, setState] = useState('desc');
    const [realData, setRealData] = useState([]);
    const [lastKey, setKey] = useState(null);
    const [lastDate, setDate] = useState(null);
    const [lastLike, setLike] = useState(null);
    const [sortSwitch, setSortSwitch] = useState(false);
    const [countData, setCountData] = useState(0);
    // const [limit, setLimit] = useState(5);

    const searchQuery = useQuery(SCROLL_QUERY, {
        variables: {
            title: search.select.title ? search.state.title : null,
            author: search.select.author ? search.state.author : null,
            content: search.select.content ? search.state.content : null,
            isMatched: search.select.match,
            sort: sort,
            BoardId: 'Board1',
            lastKey: lastKey,
            createdAt: lastDate,
            like: lastLike,
        },
    }); //검색필터링된 게시글(검색하지 않을 시 전체 데이터)

    const searchCount = useQuery(SEARCH_COUNT, {
        variables: {
            BoardId: 'Board1',
            title: search.select.title ? search.state.title : null,
            author: search.select.author ? search.state.author : null,
            content: search.select.content ? search.state.content : null,
            isMatched: search.select.match,
        },
    });

    const { loading, error, data } = searchQuery;

    const searchSwitch = props.searchSwitch;
    const setSearchSwitch = props.setSearchSwitch;

    useEffect(() => {
        if (data) {
            if (searchSwitch || sortSwitch) {
                setKey(null);
                setDate(null);
                setLike(null);
                setRealData([]);
                setSearchSwitch(false);
                setSortSwitch(false);
            } else {
                setRealData(realData => realData.concat(data.searchBoards));
            }
        }

        return () => {
            if (props.end) setRealData([]);
        };
    }, [data, props.end, searchSwitch, setSearchSwitch, sortSwitch, setSortSwitch]);

    useEffect(() => {
        const data = searchCount.data;
        if (data) {
            setCountData(data.getSearchCount.count);
        }
    }, [searchCount.data]);

    if (loading || searchCount.loading) return <p>Board loading...</p>;
    if (error || searchCount.error) return <p>Board error</p>;

    const list = realData.map((board, index) => (
        <Board end={props.end} setEnd={props.setEnd} key={board._id} seq={index} info={board} />
    ));

    const SortClick = e => {
        e.preventDefault();

        setSortSwitch(true);
        if (e.target.id === 'recent') {
            if (sort === 'desc') setState('asc');
            else setState('desc');
        } else {
            if (sort === 'like') setState('dislike');
            else setState('like');
        }
    };

    const MoreClick = e => {
        e.preventDefault();
        const lastIndex = realData.length - 1;
        setKey(realData[lastIndex]._id);
        if (sort === 'desc' || sort === 'asc') {
            setDate(realData[lastIndex].createdAt);
            setLike(null);
        } else {
            setLike(parseInt(realData[lastIndex].like));
            setDate(null);
        }
        props.setUpdate(true);
    };

    const RecentSort = () => {
        switch (sort) {
            case 'desc':
                return <CaretDownFill />;
            case 'asc':
                return <CaretUpFill />;
            default:
                return '';
        }
    };

    const LikeSort = () => {
        switch (sort) {
            case 'like':
                return <CaretUpFill />;
            case 'dislike':
                return <CaretDownFill />;
            default:
                return '';
        }
    };

    return (
        <React.Fragment>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th id="seq">No.</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th onClick={SortClick} id="recent">
                            생성날짜 <RecentSort />
                        </th>
                        <th>수정날짜</th>
                        <th onClick={SortClick} id="like">
                            Like <LikeSort />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {countData > 0 ? (
                        list
                    ) : (
                        <tr>
                            <td style={{ textAlign: 'center' }} colSpan="6">
                                데이터가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button disabled={countData === 0} onClick={MoreClick}>
                    더보기
                </Button>
            </div>
        </React.Fragment>
    );
};

const Board = props => {
    const { _id, title, author, createdAt, updatedAt, like, label } = props.info;
    const labelList = label.map((data, index) => {
        switch (data) {
            case 'help_wanted':
                return (
                    <Badge key={_id + index} variant="primary" className="mr-1">
                        help wanted
                    </Badge>
                );
            case 'bug':
                return (
                    <Badge key={_id + index} variant="danger" className="mr-1">
                        bug
                    </Badge>
                );
            case 'documention':
                return (
                    <Badge key={_id + index} variant="secondary" className="mr-1">
                        documention
                    </Badge>
                );
            case 'enhancement':
                return (
                    <Badge key={_id + index} variant="success" className="mr-1">
                        enhancement
                    </Badge>
                );
            case 'duplicate':
                return (
                    <Badge key={_id + index} variant="warning" className="mr-1">
                        duplicated
                    </Badge>
                );
            case 'question':
                return (
                    <Badge key={_id + index} variant="dark" className="mr-1">
                        question
                    </Badge>
                );
            case 'good_first_issue':
                return (
                    <Badge key={_id + index} variant="light" className="mr-1">
                        good first issue
                    </Badge>
                );
            default:
                return <p key={_id + index}>nothing..</p>;
        }
    });

    const history = useHistory();

    const handleClick = async e => {
        e.preventDefault();
        await props.setEnd(true);
        history.push(`/board/${_id}`);
    };
    return (
        <tr onClick={handleClick}>
            <td>{props.seq + 1}</td>
            <td>
                {title}
                <p></p>
                {labelList}
            </td>
            <td>{author}</td>
            <td>{dayjs(createdAt.split('Z')[0]).format('YYYY-MM-DD HH:mm')}</td>
            <td>
                {dayjs(updatedAt.split('Z')[0]).format('YYYY-MM-DD HH:mm')}
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

export default withRouter(BoardList_Scroll);
