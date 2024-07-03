
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialState = {
  users: [],
  currentUser: null,
  dialogState: {
    UpdateUserDialog: false,
  },
};

// Async thunk for registering a user
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
    handleUpdateUser: (state, action) => {
      const { firstName, lastName } = action.payload;
      state.currentUser.firstName = firstName;
      state.currentUser.lastName = lastName;
      toast.success('Profile Updated Successfully!');
    },
    handleUpdateUserDialog: (state, action) => {
      state.dialogState.UpdateUserDialog = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        // Handle pending state if needed
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        toast.success('Successfully Signed Up!');
      })
      .addCase(registerUser.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to register');
      })
      .addCase(loginUser.pending, (state) => {
        // Handle pending state if needed
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        toast.success('Login Successfull!');
      })
      .addCase(loginUser.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to login');
      });
  },
});

export const { login, logout, handleUpdateUser, handleUpdateUserDialog } = userSlice.actions;
export default userSlice.reducer;

