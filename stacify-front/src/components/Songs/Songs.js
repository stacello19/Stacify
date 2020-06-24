import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styles from './Songs.scss';
import classNames from 'classnames/bind';
import querystring from 'querystring';
import Players from './Player/Player';
import Nav from './ImageColor/ImageColor';
import { bindActionCreators } from 'redux';
import * as actions from 'reducers';
import axios from 'axios';
import Navbar from 'components/Navbar';
import NoSong from './NoSong/NoSong';

const cx = classNames.bind(styles);

class Songs extends PureComponent {

    async componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, { passive: true } )
        const { tracks } = this.props.songs;
        const { access_token, getSongData } = this.props;

        
        if(!tracks) {
            let query = querystring.parse(window.location.search.substring(1));
                query = querystring.stringify(query);
        
            const response = await axios({
                url: `https://api.spotify.com/v1/recommendations?${query}`,
                headers: {
                   'Authorization': 'Bearer ' + access_token
                }
            });
            getSongData(response.data);
        }
    }

    handleScroll = () => {
        const sections = document.querySelectorAll('.list');
        const lazys = document.querySelectorAll('.lazy');

        const config = {
            threshold: 0.5
          };

        let observer = new IntersectionObserver(function(entries) {
            
            entries.forEach(entry => {
                
                if(entry.isIntersecting) {
                    intersectionHandler(entry);
                }
            })
        }, config)
        let observer2 = new IntersectionObserver(function(entries) {
            
            entries.forEach(entry => {
                
                if(entry.isIntersecting) {
                    lazyLoading(entry);
                }
            })
        }, config)

        sections.forEach(section => {
            observer.observe(section);
        });
        lazys.forEach(lazy => {
            observer2.observe(lazy);
        })

        function intersectionHandler(entry) {
            const id = entry.target.id;
         
            const currentlyActive = document.querySelector('li.active');
            const shouldBeActive = document.querySelector(`li[data-ref=${id}]`)
       
            if(currentlyActive) {
                currentlyActive.classList.remove('active')
            }
            if(shouldBeActive) {
                shouldBeActive.classList.add('active');
            }
        }

        let that = this;
        function lazyLoading(entry) {

            const { songs } = that.props;
            const player = entry.target
            const id = parseInt(entry.target.id);

            if(player.classList[0] === 'lazy') {
                player.src = `https://open.spotify.com/embed?uri=${songs.tracks[id].uri}`;
                player.classList.remove('lazy');
                observer.unobserve(player);
            }
        }
    }

    render() {

        const { getColors, colors, songs } = this.props;
        return (
            <React.Fragment>
                <div className={cx('songTop')}>
                    <Navbar />
                    <ul className={cx('songListNav')}>
                       { songs.tracks && <Nav tracks={songs.tracks} gotColors={getColors}/> }
                    </ul>
                </div>
                <div className={cx('songListDiv')}>
                    { songs.tracks ? <Players tracks={songs.tracks} colors={colors}/> : <NoSong /> }
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    (state) => ({
        songs: state.songs,
        colors: state.colors,
        access_token: state.access_token,
        refresh_token: state.refresh_token
    }),
    (dispatch) => ({
        getColors: bindActionCreators(actions.getColors, dispatch),
        getSongData: bindActionCreators(actions.getSongData, dispatch)
    })
)(Songs)