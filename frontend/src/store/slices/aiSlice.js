import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const getSmartCategory = createAsyncThunk(
  'ai/getSmartCategory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/categorize', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get category');
    }
  }
);

export const getInsights = createAsyncThunk(
  'ai/getInsights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/ai/insights');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get insights');
    }
  }
);

export const getAnomalies = createAsyncThunk(
  'ai/getAnomalies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/ai/anomalies');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get anomalies');
    }
  }
);

export const getBudgetRecommendations = createAsyncThunk(
  'ai/getBudgetRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/ai/budget-recommendations');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get recommendations');
    }
  }
);

export const parseNaturalLanguage = createAsyncThunk(
  'ai/parseNaturalLanguage',
  async (text, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/parse-natural-language', { text });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to parse text');
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    insights: [],
    anomalies: [],
    budgetRecommendations: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearInsights: (state) => {
      state.insights = [];
    },
    clearAnomalies: (state) => {
      state.anomalies = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get insights
      .addCase(getInsights.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getInsights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.insights = action.payload.insights || [];
      })
      .addCase(getInsights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get anomalies
      .addCase(getAnomalies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAnomalies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.anomalies = action.payload.anomalies || [];
      })
      .addCase(getAnomalies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get budget recommendations
      .addCase(getBudgetRecommendations.fulfilled, (state, action) => {
        state.budgetRecommendations = action.payload.recommendations || [];
      });
  },
});

export const { clearInsights, clearAnomalies } = aiSlice.actions;
export default aiSlice.reducer;
