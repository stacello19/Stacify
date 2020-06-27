import React from 'react';
import styles from './Player.scss';
import classNames from 'classnames/bind';
import { RenderImages } from 'components/Images/Images';
import { RenderColors } from '../ImageColor';


const cx = classNames.bind(styles);

const Players = (props) => {
    const { tracks, colors } = props; 

    return tracks.map((song, i) =>  {

        return (
            <div className={cx(`list`)} id={cx(`id${i}`)} key={i}>
                <div className={cx(`colorlist`)}>
                   <RenderColors pic={song.album.images[0].url} name={song.name}/> 
                </div>
                <div className={cx('music-container')}>
                  <div className={cx('musicData')}>
                      <h3>{song.name}</h3>
                      <iframe className={cx('lazy')} id={`${i}`} title='play song' width="300" height="380" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                  </div>
                  <div className={cx('artData')}>
                    <h4><a href="https://www.pexels.com">Photos provided by Pexels</a></h4>
                    { Object.keys(colors).length > 0 && <RenderImages name={song.name} colors={colors} /> }
                  </div>
                </div>
            </div>
        )
    })
}

export default Players;