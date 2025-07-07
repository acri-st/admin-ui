import { configureStore } from '@reduxjs/toolkit';
import { FWKReduxState, reducers } from '@desp-aas/desp-ui-fwk';
import generalReducer from './generalReducer';

export const store = configureStore({
    reducer: {
        ...reducers,
        general: generalReducer,
    },
});

export type ReduxState = ReturnType<typeof store['getState']> & FWKReduxState

export default store;