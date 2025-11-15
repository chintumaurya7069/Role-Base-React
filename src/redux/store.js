import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slice/user/userSlice";
import VendorReducer from "./slice/vendor/vendorSlice";
import roleSlice from "./slice/roles/roleSlice";
import figurinesSlice from "./slice/figurine/figurineSlice";
import userRoleSlice from "./slice/refreshAPi/refreshApiSlice";
import departmentSlice from "./slice/department/departmentSlice";
import uinGenerationSlice from "./slice/uinGeneration/uinGenerationSlice";
import customerSlice from "./slice/customer/customerSlice";
import dashboardSlice from "./slice/dashboard/dashboardSlice";
import reportSlice from "./slice/report/reportSlice";
import genreSlice from "./slice/genre/genreSlice";
import ageGroupSlice from "./slice/ageGroup/ageGroupSlice";

// Configuration for persisted slices
const persistConfig = {
  key: "root",
  storage,
  whitelist: [], // Only these 3 slices will be persisted
};

// Combine reducers
const rootReducer = combineReducers({
  users: userReducer,
  vendors: VendorReducer,
  roles: roleSlice,
  figurines: figurinesSlice,
  userRole: userRoleSlice,
  department: departmentSlice,
  uinGeneration: uinGenerationSlice,
  customers: customerSlice,
  dashboards: dashboardSlice,
  reports: reportSlice,
  genres: genreSlice,
  ageGroups: ageGroupSlice,
});

// Wrap rootReducer with persistReducer (only the whitelisted ones will persist)
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Create persistor object
export const persistor = persistStore(store);

export default store;
