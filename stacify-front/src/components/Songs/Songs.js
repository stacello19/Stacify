import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ColorExtractor } from 'react-color-extractor';
import styles from './Songs.scss';
import classNames from 'classnames/bind';
import querystring from 'querystring';

const cx = classNames.bind(styles);

class Songs extends PureComponent {
    constructor() {
        super();
        this.state = { tracks: [], colors: [] };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, { passive: true } )

        const tracks = !this.props.songs.tracks ? [] : this.props.songs.tracks;
        if(!tracks) {
            const query = querystring.parse(window.location.search.substring(1));
            console.log(query)
            // const response = await axios({
            //     url: `https://api.spotify.com/v1/recommendations?${query}`,
            //     headers: {
            //        'Authorization': 'Bearer ' + token
            //     }
            // });
        }
        this.setState({ tracks });   
    }

    gettingImages = () => {
        const { tracks } = this.state;
  
        return tracks.map((image, id) => {
            return (
                <li key={id} data-ref={`id${id}`}>
                    <ColorExtractor getColors={this.getColors}>
                        <img src={image.album.images[0].url} alt={image.album.name} width='50' height='50' />
                    </ColorExtractor>
                </li>
            )
        })
    }

    getColors = colors => {
        this.setState(state => ({ colors: [...state.colors, colors] }))
    }

    renderSwatches = (colors) => {
        return colors.map((color, id) => {
          return (
            <div
              key={id}
              className={cx('colorDiv')}
              style={{
                backgroundColor: color,
                width: '15rem',
                height: '6rem'
              }}
            />
          )
        })
      }

    players = () => {
        const { tracks, colors } = this.state;
  
        return tracks.map((song, i) =>  {

            return (
                <div className={cx(`list`)} id={cx(`id${i}`)} key={i}>
                    <div className={cx(`colorlist`)}>
                        { colors[i] && this.renderSwatches(colors[i]) }
                    </div>
                    <div className={cx('musicData')}>
                        <h3>{song.name}</h3>
                        <iframe src={`https://open.spotify.com/embed?uri=${song.uri}`} width="300" height="380" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                    </div>
                </div>
            )
        })
    }

    handleScroll = () => {
        const sections = document.querySelectorAll('.list')

        
        const config = {
            threshold: 0.5
          };

        let observer = new IntersectionObserver(function(entries, self) {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    intersectionHandler(entry);
                }
            })
        }, config)

        sections.forEach(section => {
            observer.observe(section)
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
    }

    render() {
        const { tracks } = this.state;
        return (
            <div className={cx('content-container')}>
                <nav>
                    <ul className={cx('songListNav')}>
                        { tracks && this.gettingImages() }
                    </ul>
                </nav>
                <div className={cx('songListDiv')}>
                    { tracks && this.players() }
                </div>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        songs: state.songs
    }),
    null
)(Songs)