import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // This is correct
import { combineReducers } from "redux";
import { reset as resetUsers } from "../Features/UserSlice";
import { reset as resetUserMessages } from "../Features/MessageSlice";
import { reset as resetFeedbacks } from "../Features/FeedbackSlice";
import { reset as resetAppointment } from "../Features/AppointmentSlics";
import { resetState as resetmedication } from "../Features/MedicationSlice"; // Updated reset import
import usersReducer from "../Features/UserSlice";
import userMessagesReducer from "../Features/MessageSlice";
import feedbacksReducer from "../Features/FeedbackSlice";
import appointmentsReducer from "../Features/AppointmentSlics";
import medicationReducer from "../Features/MedicationSlice";

// Redux Persist config
const persistConfig = {
  key: "reduxstore",
  storage,
};

// Combine reducers into one rootReducer
const rootReducer = combineReducers({
  users: usersReducer,
  userMessages: userMessagesReducer,
  feedbacks: feedbacksReducer,
  appointments: appointmentsReducer,
  medication: medicationReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
        ],
      },
    }),
});

// Create the persist store
const persistore = persistStore(store);

// Reset store function
const resetStore = () => {
  store.dispatch(resetUsers()); // Reset users state
  store.dispatch(resetUserMessages()); // Reset userMessages state
  store.dispatch(resetFeedbacks()); // Reset feedbacks state
  store.dispatch(resetAppointment());
  store.dispatch(resetmedication()); // Corrected reset function name
};

export { store, persistore, resetStore };
