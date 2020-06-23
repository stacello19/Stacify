import React from 'react';
import styles from './NoSong.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const NoSong = () => (
    <React.Fragment>
        <h1 className={cx('noSongs')}>Please choose your songs in Home Page</h1>
    </React.Fragment>
);

export default NoSong;