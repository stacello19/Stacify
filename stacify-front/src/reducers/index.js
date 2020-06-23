import { createAction, handleActions } from 'redux-actions';

const SONGDATA = 'SONGDATA';
const GET_TOKEN = 'GET_TOKEN';
const GET_COLORS = 'GET_COLORS';
const LOGOUT = 'LOGOUT';
const GETQUERY = 'GETQUERY';
const GET_INFO = 'GET_INFO';

export const getSongData = createAction(SONGDATA, songs => songs)
export const getToken = createAction(GET_TOKEN, (access_token, refresh_token) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    return {access_token, refresh_token}
});
export const getColors = createAction(GET_COLORS, colors => colors);
export const logOut = createAction(LOGOUT, () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return null;
})
export const getQuery = createAction(GETQUERY, query => query)
export const getInfo = createAction(GET_INFO, (display_name, spotifyProfile) => ({display_name, spotifyProfile}));

const initialState = {
    colors: [],
    songs: {},
    access_token: localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null,
    refresh_token: localStorage.getItem('refresh_token') ? localStorage.getItem('refresh_token') : null,
    query: '',
    display_name: null,
    spotifyProfile: null
};;

const reducers = handleActions({
    SONGDATA: (state, action) => ({
        ...state,
        songs: action.payload
    }),
    GET_TOKEN: (state, action) => {
            const { access_token, refresh_token } = action.payload;
        return {
            ...state,
            access_token,
            refresh_token
        }
    },
    GET_INFO: (state, action) => {
        const { display_name, spotifyProfile } = action.payload;
        return {
            ...state,
            display_name,
            spotifyProfile
        }
    },
    GET_COLORS: (state, action) => {
        return {
            ...state,
            colors: [...state.colors, action.payload]
        }
    },
    LOGOUT: (state, action) => {
        return {
            ...state,
            access_token: null,
            refresh_token: null
        }
    },
    GETQUERY: (state, action) => {
        return {
            ...state,
            query: action.payload
        }
    }
}, initialState)

export default reducers;