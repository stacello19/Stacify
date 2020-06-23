import React, { PureComponent } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import * as actions from 'reducers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Home extends PureComponent {

    constructor() {
        super();
        this.state={ display_name: '', 
                     spotifyProfile: '',
                     seed_genres: 'acoustic',
                     target_acousticness: 0,
                     target_danceability: 0,
                     target_energy: 0,
                     target_instrumentalness: 0,
                     target_liveness: 0,
                     target_loudness: 0,
                     target_mode: 0,
                     target_tempo: 0,
                     loginDirect: false };
        this.d3Chart = React.createRef();
    }

    async componentDidMount() {
        const { getToken } = this.props;
        const params = this.getHashParams();
        let access_token = params.access_token;
        let refresh_token = params.refresh_token;

        this.getUserData(access_token);
        getToken(access_token, refresh_token);
        this.createChart();
    }
    
   
    createChart = () => {
        let that = this;
        const height = 400;
        const width = 400;
        const names = ['target_acousticness', 'target_danceability', 'target_energy', 'target_instrumentalness', 'target_liveness', 'target_loudness', 'target_mode', 'target_tempo']
        const nodes = d3.range(8).map(function(i) { return {name: names[i], radius: 25, x: Math.random() * 85 + 100, y: Math.random() * 95 +200}; })
        const color = d3.scaleOrdinal(d3.schemePastel2);
    
        const svg = d3.select(this.d3Chart.current)
                        .append('svg')
                            .attr('width', width)
                            .attr('height', height)
                            .style('border', '1px solid black')

        //Force for the circles
        d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength(5))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(function(d) {
                return d.radius+20;
            }))
            .on('tick', ticked);

        //Force for the texts
        d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength(5))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(function(d) {
                return d.radius+20;
            }))
            .on('tick', ticked2);
        
        
        function ticked2() {
            const texts = svg.selectAll("text")
                                .data(nodes.slice())
                                .enter()

            texts.append("text")
                    .merge(texts)
                    .attr('x', (d) => d.x)
                    .attr('y', (d) => d.y)
                    .attr('font-size', '15px')
                    .text((d) => d.name.split('_')[1])
                    .style('text-anchor', 'middle')
        }

        function ticked() {
          
            const circles = svg.selectAll('circle')
                            .data(nodes.slice())
                    
            circles.enter().append('circle')
                    .attr('r', (d) => d.radius)
                    .merge(circles)
                    .attr('class', (d) => d.name)
                    .attr('cx', (d) => d.x)
                    .attr('cy', (d) => d.y)
                    .style('fill', (d, i) => color(i))
                    .on('click', function(d) {
                        d3.select(this)
                            .attr('r', function() {
                                if(d.radius <= 24) {
                                    return d.radius = 25;
                                }
                                else {
                                    return d.radius -= 5;
                                }
                            })
                            
                        if(d.name === 'target_mode') {
                            if(d.radius < 55) {
                                that.setState({ 'target_mode': 0 })
                            } else {
                                that.setState({ 'target_mode': 1 })
                            }
                        } else {
                            that.setState({ [d.name]: that.calcPerc(d.radius) })
                        }
                    })

            circles.exit().remove()

            const dragHandler = d3.drag()
                                    .on('drag', function(d) {
                                        d3.select(this)
                                            .attr('r', function() {
                                                if(d.radius >= 81) {
                                                    return d.radius = 80;
                                                }
                                                else {
                                                    return d.radius += 1; 
                                                }
                                            })

                                        if(d.name === 'target_mode') {
                                            if(d.radius >= 55) {
                                                that.setState({ 'target_mode': 1 })
                                            } else {
                                                that.setState({ 'target_mode': 0 })
                                            }
                                        } else {
                                            that.setState({ [d.name]: that.calcPerc(d.radius) })
                                        }
                                    })
            dragHandler(circles);
        }
    }

    calcPerc = (num) => {
        if(num >= 25 && num < 30) {
            return 0;
        } else if(num >= 30 && num < 35) {
            return 0.1;
        } else if(num >= 35 && num < 40) {
            return 0.2;
        } else if(num >= 40 && num < 45) {
            return 0.3;
        } else if(num >= 45 && num < 50) {
            return 0.4;
        } else if(num >= 50 && num < 55) {
            return 0.5;
        } else if(num >= 55 && num < 60) {
            return 0.6;
        } else if(num >= 60 && num < 65) {
            return 0.7;
        } else if(num >=65 && num < 70) {
            return 0.8;
        } else if(num >= 75 && num < 80) {
            return 0.9;
        } else {
            return 1;
        }
    }

    getHashParams = () => {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
        e = r.exec(q);
        }
        return hashParams;
    }

    getUserData = async (token) => {
        const { getToken, refresh_token, getInfo } = this.props;
        try {
            const response = await axios({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                   'Authorization': 'Bearer ' + token
                }
            }); 

            const { display_name, external_urls } = response.data;
            const spotifyProfile = external_urls.spotify;

            getInfo(display_name, spotifyProfile)
            this.setState({ display_name, spotifyProfile })
        } catch(e) {
            const response = await axios.get(`http://localhost:9000/test/refresh_token?refresh_token=${refresh_token}`)
            const access_token = response.data.access_token;
            
            getToken(access_token, refresh_token);
            this.getUserData(access_token)
        }
    }

    getRecommendation = async (token) => {
        const { seed_genres, target_acousticness, target_danceability, target_energy, target_instrumentalness,
                target_liveness, target_loudness, target_mode, target_tempo } = this.state;
        const { getSongData, getQuery } = this.props;
        const query = querystring.stringify({
            market: 'US',
            seed_genres,
            target_acousticness,
            target_danceability,
            target_energy,
            target_instrumentalness,
            target_liveness,
            target_loudness,
            target_mode,
            target_tempo 
            });

    
        try {
            const response = await axios({
                url: `https://api.spotify.com/v1/recommendations?${query}`,
                headers: {
                   'Authorization': 'Bearer ' + token
                }
            });
            getSongData(response.data);
            getQuery(query);
            this.props.history.push({
                pathname: '/songs',
                search: query
            });   
        } catch(e) {
            alert('Your Login Session expired. Redirecting to Login Page')
            this.props.history.push('/');
        }
    }

    listenChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { access_token } = this.props;

        this.getRecommendation(access_token)
    }

    render() {
        const { display_name, spotifyProfile } = this.state;

        return (
            <div className='homeDiv' style={{backgroundColor: 'white'}}>
                <p>Name: {display_name}</p>
                <p>url: {spotifyProfile}</p>
                <div ref={this.d3Chart}></div>
                <form onSubmit={this.handleSubmit}>
                    genres: <select name='seed_genres' onChange={this.listenChange}> 
                                <option value="acoustic">acoustic</option>
                                <option value="blues">blues</option>
                                <option value="classical">classical</option>
                                <option value="club">club</option>
                                <option value="country">country</option>
                                <option value="disney">disney</option>
                                <option value="electro">electro</option>
                                <option value="groove">groove</option>
                                <option value="jazz">jazz</option>
                                <option value="pop">pop</option>
                                <option value="tango">tango</option>
                            </select>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        );
    }
}

Home.propTypes = {
    seed_genres: PropTypes.string,
    display_name: PropTypes.string, 
    target_acousticness: PropTypes.number,
    target_danceability: PropTypes.number,
    target_energy: PropTypes.number,
    target_instrumentalness: PropTypes.number,
    target_liveness: PropTypes.number,
    target_loudness: PropTypes.number,
    target_mode: PropTypes.number,
    target_tempo: PropTypes.number
}

export default connect(
    (state) => ({
        access_token: state.access_token,
        refresh_token: state.refresh_token
    }), 
    (dispatch) => ({
        getSongData: bindActionCreators(actions.getSongData, dispatch),
        getToken: bindActionCreators(actions.getToken, dispatch),
        getQuery: bindActionCreators(actions.getQuery, dispatch),
        getInfo: bindActionCreators(actions.getInfo, dispatch)
    })
)(withRouter(Home));