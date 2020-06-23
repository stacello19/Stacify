import React from 'react';
import styles from './Player.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Players = (props) => {
    const { tracks, colors } = props;

    // TODO: WORKING NOW : the number of iframe 'player' depends on tracks
    return tracks.map((song, i) =>  {

        return (
            <div className={cx(`list`)} id={cx(`id${i}`)} key={i}>
                <div className={cx(`colorlist`)}>
                   { colors[i] && <RenderSwatches color={colors[i]}/> }
                </div>
                <div className={cx('musicData')}>
                    <h3>{song.name}</h3>
                    {/* loading="lazy" */}
                    {/* src={`https://open.spotify.com/embed?uri=${song.uri}`} */}
                    <iframe className="audio-player" src='about:blank' width="300" height="380" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                    {/* <iframe src={`https://open.spotify.com/embed?uri=${song.uri}`} width="300" height="380" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe> */}
                </div>
            </div>
        )
    })
}

const RenderSwatches = (color) => {

    return color.color.map((color, id) => {
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

export default Players;
