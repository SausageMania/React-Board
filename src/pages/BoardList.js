import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Table, Button, Form, Pagination, Badge } from 'react-bootstrap';
import { Route, Link, useHistory } from 'react-router-dom';
import CreateBoard from './CreateBoard';
import qs from 'qs';
import { BOARDS_QUERY, SEARCH_QUERY, TOTAL_COUNT, SEARCH_COUNT } from '../gql/query';
import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CaretDownFill } from 'react-bootstrap-icons';

const BoardList = ({ location, history }) => {
    const [state, setState] = useState({
        select: 'title',
        search: '',
        sort: 'recent',
        limit: 5,
        currPage: 1,
    });
    const [active, setActive] = useState(1);

    //검색버튼을 누르면 parameter로 'select'와 'search'를 넘겨줌.
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    const doSearch = params.search !== '' && params.search != null ? true : false;

    const totalQuery = useQuery(BOARDS_QUERY, { skip: doSearch }); //검색을 하지 않을 때의 모든 게시글
    const searchQuery = useQuery(SEARCH_QUERY, {
        variables: { [params.select]: params.search },
        skip: !doSearch,
    }); //검색필터링된 게시글

    const totalCount = useQuery(TOTAL_COUNT, { skip: doSearch }); //검색을 하지 않을 떄의 게시글 갯수
    const searchCount = useQuery(SEARCH_COUNT, {
        variables: { [params.select]: params.search },
        skip: !doSearch,
    }); //검색필터링 된 게시글 갯수

    //const [searchClick, {data, loading}] = useLazyQuery(SEARCH_QUERY, {variables:{[state.select]:state.search} });

    const { loading, error, data, refetch } = doSearch ? searchQuery : totalQuery;

    useEffect(() => {
        if (data != null) {
            refetch();
        }
        return () => {
            setState({
                select: 'title',
                search: '',
                sort: 'recent',
                limit: 5,
                currPage: 1,
            });
        };
    }, [data, refetch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    const realData = doSearch ? data.searchBoards : data.getBoards;
    const list = realData.map((board, index) => <Board key={board._id} seq={index} info={board} />);

    const SortClick = e => {
        //정렬 을 위해 테이블을 클릭할 경우
        const sortValue = e.target.id;
        setState({
            ...state,
            sort: sortValue,
        });
        if (doSearch) searchQuery.refetch({ sort: sortValue, page: active });
        else totalQuery.refetch({ sort: sortValue, page: active });
    };

    const HandleChange = e => {
        //검색란에 값을 칠 경우
        console.log(e.target.name);
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const SearchClick = () => {
        //검색 버튼을 누를 경우
        window.location.href = '?select=' + state.select + '&search=' + state.search;
        //history.push('?select=' + state.select + '&search=' + state.search);
    };

    const PageInto = number => {
        const page = number;
        setActive(page);

        if (doSearch) searchQuery.refetch({ page: page });
        else totalQuery.refetch({ page: page });
    };

    const Pages = () => {
        const { limit } = state;
        const { loading: pageLoading, error: pageError, data: pageData } = doSearch
            ? searchCount
            : totalCount;

        if (pageLoading) return <p>loading...</p>;
        if (pageError) return <p>error</p>;

        const dataCount = doSearch ? pageData.getSearchCount.count : pageData.getBoardsCount.count;
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
                <Form style={{ float: 'right' }} inline>
                    {/*
                    <Form.Control
                        name="select"
                        onChange={HandleChange}
                        as="select"
                        custom
                        className="mr-1"
                        defaultValue={params.select}
                    >
                        <option value="title">제목</option>
                        <option value="author">작성자</option>
                        <option value="content">내용</option>
                    </Form.Control>
                    */}
                    <Form.Control
                        type="text"
                        name="search"
                        onChange={HandleChange}
                        placeholder="검색"
                        className="mr-1"
                        defaultValue={params.search}
                    />
                    <Button variant="outline-success" onClick={SearchClick}>
                        검색
                    </Button>
                </Form>
            </div>
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th onClick={SortClick} id="seq">
                                <CaretDownFill />
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
