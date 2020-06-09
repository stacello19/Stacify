import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { LoginPage, HomePage, SongPage, NotFoundPage } from 'pages';

const Root = () => {
    return (
        <div>
            <Switch>
                <Route exact path='/' component={LoginPage} />
                <Route path='/home' component={HomePage} />
                <Route path='/songs' component={SongPage} />
                <Route component={NotFoundPage}/>
            </Switch>
        </div>
    )
}

export default Root;