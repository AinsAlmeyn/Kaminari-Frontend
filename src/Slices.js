import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        isLoading: false,
        messageModalShow: false,
        messageModalBody : "",
    },
    reducers: {
        // isLoading state'ini güncelleyen reducer
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setMessageModalShow: (state, action) => {
            state.messageModalShow = action.payload;
        },
        setMessageModalBody: (state, action) => {
            state.messageModalBody = action.payload;
        }
    },
    extraReducers: (builder) => {
    }
});

// setLoading action'ını dışa aktarın
export const { setLoading, setMessageModalBody, setMessageModalShow } = appSlice.actions;

export default appSlice.reducer;