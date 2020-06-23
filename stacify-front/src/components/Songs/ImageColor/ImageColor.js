import React from 'react';
import { ColorExtractor } from 'react-color-extractor';

const Nav = (props) => {
    const { tracks, gotColors } = props;

    const coloring = (colors) => {
        gotColors(colors);
    }
    return tracks.map((image, id) => {
        return (
            <li key={id} data-ref={`id${id}`}>
                <ColorExtractor getColors={coloring}>
                    <img src={image.album.images[0].url} alt={image.album.name} width='50' height='50' />
                </ColorExtractor>
            </li>
        )
    })
}

export default Nav;


