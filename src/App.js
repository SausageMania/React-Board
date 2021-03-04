import React from 'react';
import BoardList from './pages/BoardList';
import CreateBoard from './pages/CreateBoard';
import UpdateBoard from './pages/UpdateBoard';
import { Route } from 'react-router-dom';

function App() {
    return (
        <div>
            <Route path="/" component={BoardList} exact />
            <Route path="/create" component={CreateBoard} />
            <Route path="/board/:userid" component={UpdateBoard} />
        </div>
    );
}

export default App;
