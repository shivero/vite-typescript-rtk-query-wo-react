import { configureStore } from "@reduxjs/toolkit";
import {favListReducer} from './counterReducer';


const $ListStore = configureStore({
    reducer: {
        favLists: favListReducer,
    }
});

export {$ListStore}