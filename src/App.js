import React from 'react';
import Home from './pages/Home';
import BoardList_Scroll from './pages/BoardList_Scroll';
import BoardList_Pagination from './pages/BoardList_Pagination';
import CreateBoard from './pages/CreateBoard';
import UpdateBoard from './pages/UpdateBoard';
import { Route, Switch } from 'react-router-dom';

function App() {
    return (
        <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/scroll" component={BoardList_Scroll} />
            <Route path="/pagination" component={BoardList_Pagination} />
            <Route path="/create" component={CreateBoard} />
            <Route path="/board/:userid" component={UpdateBoard} />
        </Switch>
    );
}

export default App;
