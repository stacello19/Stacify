import React from 'react';

const scrollDiv = (e) => {
    const div = document.getElementById(e.target.name);
    div.scrollIntoView({behavior: "smooth", block: "start"});
}

const Nav = (props) => {
    const { tracks } = props;

    return tracks.map((image, id) => {
        return (
            <li key={id} onClick={scrollDiv} data-ref={`id${id}`} style={{cursor: 'pointer'}}>
                <img src={image.album.images[0].url} name={`id${id}`} alt={image.album.name} width='50' height='50' />
            </li>
        )
    })
}

export default Nav;


