import React from 'react';
import { createClient } from 'pexels';

const client = createClient('563492ad6f91700001000001c8f8d31aaeff4e7b8c2ce22777e89401');

let anchorPoint = {
    'White': {r: 100, g: 100, b: 100},
    'Black': {r: 0, g: 0, b: 0},
    'Gray': {r: 50, g: 50, b: 50},
    'Red': {r: 50, g: 0, b: 0},
    'Yellow': {r: 100, g: 100, b: 0},
    'Moss': {r: 50, g: 50, b: 0},
    'Green': {r: 0, g: 50, b: 0},
    'Aqua': {r: 0, g: 100, b: 100},
    'Teal': {r: 0, g: 50, b: 50},
    'Blue': {r: 0, g: 0, b: 50},
    'Purple': {r: 50, g: 0, b: 50}
}

  
const  hexToRgb = (arr) => {

    return arr.map(hex => {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    })
};
  
const calcColor = (arr) => {
    let resObj ={r: 0, g: 0, b: 0}
    arr.forEach(obj => {
        resObj.r += obj.r;
        resObj.g += obj.g;
        resObj.b += obj.b;
    });

    resObj.r = Math.floor((resObj.r/1530)*100);
    resObj.g = Math.floor((resObj.g/1530)*100);
    resObj.b = Math.floor((resObj.b/1530)*100);

    return resObj;
}
  
const transferring = (obj) => {

for(let rgb in obj) {
    if(obj[rgb] < 50) {
    obj[rgb] = 0;
    } else {
    if(obj[rgb] >=50 && obj[rgb] <= 75) {
        obj[rgb] = 50;
    } else {
        obj[rgb] = 100;
    }
    }
}
return obj;
}
  
const getColorName = (obj) => {

    for(let key in anchorPoint) {
        let compareObj = anchorPoint[key];
        if(compareObj.r == obj.r && compareObj.g == obj.g && compareObj.b == obj.b) {
            return key
        }
    }
    return null;
}

export const RenderImages = (props) => {

    let res = calcColor(hexToRgb(props.colorBase));
    let reformattedRes = transferring(res);
    let query = getColorName(reformattedRes);
    let imgs;

    // client.photos.search({ query, per_page: 40 }).then(photos => {
    //     imgs = photos.photos.map(photo => ({photographer: photo.photographer, picture: photo.src.small}))
    //     console.log(imgs);
    // });
    // if(imgs !== []) {
    //     return imgs.map((image, i) => {
    //         return (
    //             <React.Fragment>
    //                 <li key={i}>
    //                     <img src={image.picture} alt={image.photographer} width='50' height='50' />
    //                 </li>
    //             </React.Fragment>
    //         )
    //     })
    // }
    return <h2>Sorry.. API rate limit exceeded</h2>
}

