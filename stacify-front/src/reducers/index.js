import { createAction, handleActions } from 'redux-actions';

export const SONGDATA = 'SONGDATA';

export const getSongData = createAction(SONGDATA, songs => songs)

const initialState = {
    songs: {}
};;

const reducers = handleActions({
    SONGDATA: (state, action) => ({
        songs: action.payload
    })
}, initialState)

export default reducers;