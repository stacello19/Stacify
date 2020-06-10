import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ColorExtractor } from 'react-color-extractor';

class Songs extends PureComponent {
    constructor() {
        super();
        this.state = { tracks: [], colors: [] };
    }

    componentDidMount() {
        console.log('Component Did Mount')
        const tracks = !this.props.songs.tracks ? [] : this.props.songs.tracks;
        this.setState({ tracks });   
    }

    gettingImages = () => {
        const { tracks } = this.state;
        return tracks.map((image, id) => {
            return (
                <li key={id} >
                    <ColorExtractor getColors={this.getColors}>
                        <img src={image.album.images[0].url} alt={image.album.name} width='50' height='50' />
                    </ColorExtractor>
                </li>
            )
        })
    }

    getColors = colors => {
        this.setState(state => ({ colors: [...state.colors, ...colors] }))
    }

    renderSwatches = () => {
        const { colors } = this.state
    
        return colors.map((color, id) => {
          return (
            <div
              key={id}
              style={{
                backgroundColor: color,
                width: 100,
                height: 100
              }}
            />
          )
        })
      }


    render() {
       
        return (
            <div>
                <nav>
                    <ul>
                        {this.gettingImages()}
                    </ul>
                </nav>
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