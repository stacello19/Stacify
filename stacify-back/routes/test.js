require('dotenv').config();
const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const request = require('request'); 

const SpotifyWebApi = require('spotify-web-api-node');

let spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL
});

let generateRandomString = function(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

let stateKey = 'spotify_auth_state';


router.get('/', (req, res, next) => {
    res.send('Backend is working!')
});

router.get('/login', (req, res) => {

    let state = generateRandomString(16);
    res.cookie(stateKey, state);
    let scopes = ['user-read-private', 'user-read-email'];
    let query =  querystring.stringify({
        response_type: 'code',
        client_id: spotifyApi._credentials.clientId,
        scope: scopes,
        redirect_uri: spotifyApi._credentials.redirectUri,
        state: state
      });
    let url = `https://accounts.spotify.com/authorize?${query}`

    res.redirect(url);
});

router.get('/callback', (req, res) => {

    // your application requests refresh and access tokens
    // after checking the state parameter
  
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: spotifyApi._credentials.redirectUri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(spotifyApi._credentials.clientId + ':' + spotifyApi._credentials.clientSecret).toString('base64'))
        },
        json: true
      };
  
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
         
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
  
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
              console.log('body:------', body);
          });
          
          // we can also pass the token to the browser to make requests from there
          res.redirect(`http://localhost:3000/home/#` +
          querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
          }));

        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
});
  
router.get('/refresh_token', function(req, res) {
    
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(spotifyApi._credentials.clientId + ':' + spotifyApi._credentials.clientSecret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
    
    request.post(authOptions, function(error, response, body) {
      
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });



module.exports = router;