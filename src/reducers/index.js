import {combineReducers} from 'redux';
import auth from './auth';
import modal from './modal';
import register from './register';
import userProfile from './userprofile';
import users from './users';

const rootReducer = combineReducers({
  auth,
  modal,
  register,
  userProfile,
  users,
});

export default rootReducer;