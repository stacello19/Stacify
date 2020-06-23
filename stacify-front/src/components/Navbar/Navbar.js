import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './Navbar.scss';
import classNames from 'classnames/bind';
import { withRouter } from 'react-router'; 
import * as actions from 'reducers';
import { bindActionCreators } from 'redux';

const cx = classNames.bind(styles);

const Navbar = (props) => {
    const { isLogged, access_token, refresh_token, logOut, query, name, spotifyProfile } = props;

    let links = (
        <React.Fragment>
            <Link className={cx('links')} to='/'>Login</Link>
        </React.Fragment>
    )
    if(isLogged) {

        links = (
            <React.Fragment>
                <div className={cx('leftNav')}>
                    <h4>Hello, ${name}</h4>
                    <a href={`${spotifyProfile}`}>My Spotify</a>
                </div>
                <div className={cx('rightNav')}>
                    <Link className={cx('links')} to='/' onClick={logOut}>Logout</Link>
                    <Link className={cx('links')} to={`/home/#access_token=${access_token}&refresh_token=${refresh_token}`}>Home</Link>
                    <Link className={cx('links')} to={`/songs?${query}`}>Song</Link>
                </div>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <nav>
                {links}
            </nav>
        </React.Fragment>
    )
};

export default connect(
    (state) => ({
        isLogged: state.access_token !== null,
        access_token: state.access_token,
        refresh_token: state.refresh_token,
        query: state.query,
        name: state.display_name,
        spotifyProfile: state.spotifyProfile
    }),
    (dispatch) => ({
        logOut: bindActionCreators(actions.logOut, dispatch)
    })
)(withRouter(Navbar));

