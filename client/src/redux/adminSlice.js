
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const apiUrl = 'http://localhost:5000/api/users';

const initialState = {
  users: [],
  status: 'idle',
  searchInput: '',
  error: null,
};

export const getUsers = createAsyncThunk('users/getUsers', async () => {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
});

export const createUser = createAsyncThunk('users/createUser', async (userData) => {
  const response = await fetch(`${apiUrl}/createUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  return response.json();
});

export const updateUser = createAsyncThunk('users/updateUser', async (userData) => {
  const { id, ...data } = userData;
  const response = await fetch(`${apiUrl}/updateUser/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return response.json();
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
  const response = await fetch(`${apiUrl}/deleteUser/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return { userId };
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        toast.success('User created successfully');
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
          toast.success('User updated successfully');
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload.userId);
        toast.success('User deleted successfully');
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
