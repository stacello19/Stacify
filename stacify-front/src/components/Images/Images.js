import React, { PureComponent } from 'react';
import { ColorExtractor } from 'react-color-extractor';
import { createClient } from 'pexels';

const client = createClient('563492ad6f91700001000001c8f8d31aaeff4e7b8c2ce22777e89401');

const query = 'Nature';



class Images extends PureComponent {
    constructor() {
        super();
        this.state = { imgs: [], colors: [] };
    }
    componentDidMount() {
        client.photos.search({ query, per_page: 20 }).then(photos => {
            let imgs = photos.photos.map(photo => ({photographer: photo.photographer, picture: photo.src.small, url: photo.url}))
            this.setState({ imgs });
        });
    }
    
    getColor = (color) => {
        this.setState(prevState => ({ colors: [...prevState.colors, color] }));
    }

    renderImages = () => {
        const { imgs } = this.state;

        return imgs.map(el => {
   
            return (
                <React.Fragment>
                    <ColorExtractor getColors={this.getColor}>
                        <img src={el.picture} alt={el.photographer} width='0' height='0' />
                    </ColorExtractor>
                </React.Fragment>
            )
        });
    }
    render() {
        const { imgs } = this.state;
       
        return (
            <div style={{display: 'flex'}}>
                { imgs && this.renderImages() }
            </div>
        )
    }
};

export default Images;