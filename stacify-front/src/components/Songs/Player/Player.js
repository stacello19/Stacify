import React from 'react';
import styles from './Player.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Players = (props) => {
    const { tracks, colors } = props; 

    return tracks.map((song, i) =>  {

        return (
            <div className={cx(`list`)} id={cx(`id${i}`)} key={i}>
                <div className={cx(`colorlist`)}>
                   { colors[i] && <RenderSwatches color={colors[i]}/> }
                </div>
                <div className={cx('musicData')}>
                    <h3>{song.name}</h3>
                    <iframe className={cx('lazy')} id={`${i}`} title='play song' width="300" height="380" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
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