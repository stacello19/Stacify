import React, { PureComponent } from 'react';
import { ColorExtractor } from 'react-color-extractor';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'reducers';

let colorArr = [];
class RenderColors extends PureComponent {
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
        const { gotColors } = this.props;

        this.setState(state => ({ colors: [...state.colors, ...colors] }));
        colorArr.push(colors)

        if(colorArr.length === 20) {
            gotColors(colorArr);
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
            {this.renderSwatches()}
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