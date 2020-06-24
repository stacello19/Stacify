import React from 'react';
import styles from './Login.scss';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import * as actions from 'reducers';

const cx = classNames.bind(styles);

const Login = (props) => {
    const { isLogged, logOut } = props;
    let div = (
        <React.Fragment>
            <h1 className={cx('h2Div')}>Login to Your Spotify</h1>
            <a href='http://localhost:9000/test/login'><button className={cx('loginBtn')}>Login</button></a>
        </React.Fragment>
    )

    if(isLogged) {
        div = (
            <React.Fragment>
                <h1 className={cx('h2Div')}>Logout from Your Spotify</h1>
                <Link to='/' onClick={logOut}><button className={cx('loginBtn')}>Logout</button></Link>
            </React.Fragment>
        )
    }
    return(
        <div className={cx('loginDiv')}>
            {div}
        </div>
    )
}


export default connect(
    (state) => ({
        isLogged: state.access_token !== null
    }),
    (dispatch) => ({
        logOut: bindActionCreators(actions.logOut, dispatch)
    })
)(Login);