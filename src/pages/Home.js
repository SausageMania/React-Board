import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Home = () => {
    const history = useHistory();
    return (
        <div
            className="m-3 p-5"
            style={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                flexFlow: 'column',
            }}
        >
            <h1>
                <b>CRUD 게시판 홈</b>
            </h1>
            <div>
                <Button onClick={() => history.push('/scroll')} className="m-2" variant="success">
                    Scroll 기반 게시판
                </Button>
                <Button
                    onClick={() => history.push('/pagination')}
                    className="m-2"
                    variant="success"
                >
                    Pagination 기반 게시판
                </Button>
            </div>
        </div>
    );
};

export default Home;
