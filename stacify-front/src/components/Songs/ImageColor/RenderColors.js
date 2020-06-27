import React, { Component } from 'react';
import { ColorExtractor } from 'react-color-extractor';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'reducers';

let colorObj = {};

class RenderColors extends Component {
    constructor(props) {
      super(props);
      this.state = { colors: [] }
    }
  
    renderSwatches = () => {
      const { colors } = this.state

      return colors.map((color, id) => {
        return (
          <div
            key={id}
            style={{
              backgroundColor: color,
              width: '15rem',
              height: '6rem'
            }}
          />
        )
      })
    }
  
    getColors = colors => {
        const { gotColors, name } = this.props;
 
        this.setState({ colors });

        colorObj = {
          ...colorObj,
          [name]: colors
        }
        if(Object.keys(colorObj).length === 20) {
            gotColors(colorObj);
        }
    }
  
    render() {
      const { pic, name } = this.props;

      return (
        <div>
          <ColorExtractor getColors={this.getColors}>
            <img
              src={pic}
              alt={name}
              style={{ width: 0, height: 0 }}
            />
          </ColorExtractor>
          <div
            style={{
              marginTop: 20,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            { this.renderSwatches() }
          </div>
        </div>
      )
    }
}

export default connect(
    null,
    (dispatch) => ({
      gotColors: bindActionCreators(actions.getColors, dispatch)
    })
  )(RenderColors);