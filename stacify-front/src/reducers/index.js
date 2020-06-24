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
    localStorage.removeItem('display_name');
    localStorage.removeItem('spotifyProfile');
    localStorage.removeItem('query');
    return null;
})
export const getQuery = createAction(GETQUERY, query => {
    localStorage.setItem('query', query);
    return query;
})
export const getInfo = createAction(GET_INFO, (display_name, spotifyProfile) => {
    localStorage.setItem('display_name', display_name);
    localStorage.setItem('spotifyProfile', spotifyProfile);
    return {display_name, spotifyProfile};
});

const initialState = {
    colors: [],
    songs: {},
    access_token: localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null,
    refresh_token: localStorage.getItem('refresh_token') ? localStorage.getItem('refresh_token') : null,
    query: localStorage.getItem('query') ? localStorage.getItem('query') : '',
    display_name: localStorage.getItem('display_name') ? localStorage.getItem('display_name') : null,
    spotifyProfile: localStorage.getItem('spotifyProfile') ? localStorage.getItem('spotifyProfile') : null,
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