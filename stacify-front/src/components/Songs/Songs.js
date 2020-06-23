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
        const { tracks } = this.props.songs;
        const sections = document.querySelectorAll('.list')
        const players = document.querySelectorAll('.audio-player')

        const config = {
            threshold: 0.5
          };
          const config1 = {
            threshold: 0.5
          };          

        let observer = new IntersectionObserver(function(entries, self) {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    intersectionHandler(entry);
                    self.unobserve(entry.target);
                }
            });         
        }, config)

        let observer1 = new IntersectionObserver(function(players, self) {
            players.forEach((player, index) => {
                if(player.isIntersecting) {
                    intersectionPlayer(player, index);
                    self.unobserve(player.target);
                }
            })            
        }, config1)

        sections.forEach(section => {
            observer.observe(section)
        })
        players.forEach(player => {
            observer1.observe(player)
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

        function intersectionPlayer(player, index) {
            console.log(tracks[index].url)
            player.target.src = `https://open.spotify.com/embed?uri=${tracks[index].uri}`;
        }
    }

    render() {

        const { getColors, colors, songs: { tracks } } = this.props;
        // TODO: somehow decoupling the tracks.map;
        const newTrack = tracks ? tracks.slice(1,3) : [];
        return (
            <React.Fragment>
                <div className={cx('songTop')}>
                    <Navbar />
                    <ul className={cx('songListNav')}>
                       { tracks && <Nav tracks={tracks} gotColors={getColors}/> }
                    </ul>
                </div>

                {/* scroll ... , */}
                <div className={cx('songListDiv')}>
                    { tracks ? <Players tracks={tracks} colors={colors}/> : <NoSong /> }
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