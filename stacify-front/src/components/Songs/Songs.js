import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ColorExtractor } from 'react-color-extractor';

class Songs extends PureComponent {
    constructor() {
        super();
        this.state = { test: '', colors: [] };
    }

    componentDidMount() {
        console.log('Component Did Mount')
        
        let test = this.props.songs.tracks[0].album.images[0].url;
        console.log(test, this.props.songs.tracks)
        this.setState({ test });     
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
                hey
                <ColorExtractor getColors={this.getColors}>
                    <img src={this.state.test} alt='test' />
                </ColorExtractor>
                {this.renderSwatches()}
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