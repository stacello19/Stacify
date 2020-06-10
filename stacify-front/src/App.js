import React, { PureComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Root from 'components/Root';
import axios from 'axios';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { data: '' }
  }

  callBackendAPI = async () => {
    const data = await axios.get('/test')
      
    this.setState({ data })
    console.log(this.state)
  }
 
  componentWillMount() {
    this.callBackendAPI();
  }


  render() {
    return (
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    );
  }
  
}


export default App;
