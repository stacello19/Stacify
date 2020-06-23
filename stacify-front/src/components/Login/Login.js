import React from 'react';
import styles from './Login.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Login = () => {
    return(
        <div className={cx('loginDiv')}>
            <h1 className={cx('h2Div')}>Login to Your Spotify</h1>
            <button className={cx('loginBtn')}><a className={cx('aLink')} href='http://localhost:9000/test/login'>Login</a></button>
        </div>
    )
}


export default Login;