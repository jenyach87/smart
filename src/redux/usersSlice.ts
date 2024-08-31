import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {AllUsers} from '../models/Users'
import axios from "axios";

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try{
    const response = await axios.get('https://jsonplaceholder.org/users');
    return response.data;
  }catch(e){
    return rejectWithValue('Failed to fetch users');
  }

});

interface UsersState {
  users: AllUsers[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
const initialState: UsersState = {
  users: [],
  status: 'idle',
  error: null,
};
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
      builder
          .addCase(fetchUsers.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(fetchUsers.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.users = action.payload;
          })
          .addCase(fetchUsers.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message || 'Something went wrong';
          });
  },
});

export default userSlice.reducer;