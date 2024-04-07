import actionTypes from "../actions/actionTypes";

const initialState = {
  isLoadingGender: false,
  genders: [],
  roles: [],
  positions: [],
  users: [],
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    //gender
    case actionTypes.FETCH_GENDER_START:
      let copyState = { ...state };
      copyState.isLoadingGender = true;
      // console.log("FETCH_GENDER_START", state);

      return {
        ...copyState,
      };
    case actionTypes.FETCH_GENDER_SUCCESS:
      state.genders = action.data;
      state.isLoadingGender = false;
      // console.log("FETCH_GENDER_SUCCESS", state);
      return {
        ...state,
      };
    case actionTypes.FETCH_GENDER_FAILED:
      state.isLoadingGender = false;
      state.genders = [];
      console.log("FETCH_GENDER_FAILED", state);

      return {
        ...state,
      };

    //position
    case actionTypes.FETCH_POSITION_SUCCESS:
      state.positions = action.data;
      // console.log("FETCH_POSITION_SUCCESS", state);
      return {
        ...state,
      };
    case actionTypes.FETCH_POSITION_FAILED:
      state.positions = [];
      // console.log("FETCH_POSITION_FAILED", state);

      return {
        ...state,
      };

    //role
    case actionTypes.FETCH_ROLE_SUCCESS:
      state.roles = action.data;
      return {
        ...state,
      };
    case actionTypes.FETCH_ROLE_FAILED:
      state.roles = [];
      return {
        ...state,
      };

    case actionTypes.FETCH_ALL_USER_SUCCESS:
      state.users = action.data;
      return {
        ...state,
      };

    case actionTypes.FETCH_ALL_USER_FAILED:
      state.users = [];
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default adminReducer;
