import actionTypes from "./actionTypes";
import {
  getAllCodeService,
  createNewUser,
  getAllUser,
  deleteUser,
  editUser,
  getTopDoctorHomeService,
  getAllDoctorService,
  saveInfoDoctorService,
  getSpecialtyHomeService,
  getClinicHomeService,
} from "../../services/userService";
import { toast } from "react-toastify";

//gender
export const fetchGenderStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.FETCH_GENDER_START });
      let res = await getAllCodeService("gender");
      if (res && res.errCode === 0) {
        // console.log("fire start", res.data);
        dispatch(fetchGenderSuccess(res.data));
      } else {
        dispatch(fetchGenderFailed());
      }
    } catch (e) {
      dispatch(fetchGenderFailed());
      console.log("fetchGenderStart Error", e);
    }
  };
};
export const fetchGenderSuccess = (dataGender) => ({
  type: actionTypes.FETCH_GENDER_SUCCESS,
  data: dataGender,
});
export const fetchGenderFailed = () => ({
  type: actionTypes.FETCH_GENDER_FAILED,
});

//position
export const fetchPositionStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.FETCH_POSITION_SUCCESS });
      let res = await getAllCodeService("position");
      if (res && res.errCode === 0) {
        console.log("FETCH_POSITION_START", res.data);
        dispatch(fetchPositionSuccess(res.data));
      } else {
        dispatch(fetchPositionFailed());
      }
    } catch (e) {
      dispatch(fetchPositionFailed());
      console.log("fetchPositionFailed Error", e);
    }
  };
};
export const fetchPositionSuccess = (dataPosition) => ({
  type: actionTypes.FETCH_POSITION_SUCCESS,
  data: dataPosition,
});
export const fetchPositionFailed = () => ({
  type: actionTypes.FETCH_POSITION_FAILED,
});

//role
export const fetchRoleStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actionTypes.FETCH_ROLE_SUCCESS });
      let res = await getAllCodeService("role");
      if (res && res.errCode === 0) {
        // console.log("fire start", res.data);
        dispatch(fetchRoleSuccess(res.data));
      } else {
        dispatch(fetchRoleFailed());
      }
    } catch (e) {
      dispatch(fetchRoleFailed());
      console.log("fetchRoleFailed Error", e);
    }
  };
};
export const fetchRoleSuccess = (dataRole) => ({
  type: actionTypes.FETCH_ROLE_SUCCESS,
  data: dataRole,
});
export const fetchRoleFailed = () => ({
  type: actionTypes.FETCH_ROLE_FAILED,
});

//create user
export const createNewUsers = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewUser(data);
      console.log("check data ", res);
      if (res && res.errCode === 0) {
        toast.success("Tạo người dùng thành công!");
        dispatch(saveUserSuccess());
        dispatch(getAllUsers());
      } else {
        toast.error("Tạo người dùng thất bại!");
        dispatch(saveUserFailed());
      }
    } catch (e) {
      dispatch(saveUserFailed());
      console.log("saveUserFailed Error", e);
    }
  };
};

export const saveUserSuccess = () => ({
  type: actionTypes.CREATE_USER_SUCCESS,
});

export const saveUserFailed = () => ({
  type: actionTypes.CREATE_USER_FAILED,
});

//get user
export const getAllUsers = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllUser("ALL");
      if (res && res.errCode === 0) {
        dispatch(getAllUserSuccess(res.users.reverse()));
      } else {
        dispatch(getAllUserFailed());
      }
    } catch (e) {
      dispatch(getAllUserFailed());
      console.log("getAllUserFailed Error", e);
    }
  };
};

export const getAllUserSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_USER_SUCCESS,
  data: data,
});

export const getAllUserFailed = (data) => ({
  type: actionTypes.FETCH_ALL_USER_FAILED,
});

//delete user
export const deleteUsers = (id) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteUser(id);
      // console.log("check data ", res);
      if (res && res.errCode === 0) {
        toast.success("Xóa người dùng thành công!");
        dispatch(deleteUserSuccess());
        dispatch(getAllUsers());
      } else {
        toast.error("Xóa người dùng thất bại!");
        dispatch(deleteUserFailed());
      }
    } catch (e) {
      dispatch(deleteUserFailed());
      console.log("deleteUserFailed Error", e);
    }
  };
};

export const deleteUserSuccess = () => ({
  type: actionTypes.DELETE_USER_SUCCESS,
});

export const deleteUserFailed = () => ({
  type: actionTypes.DELETE_USER_FAILED,
});

//edit user
export const editUsers = (id) => {
  return async (dispatch, getState) => {
    try {
      let res = await editUser(id);
      // console.log("check data ", res);
      if (res && res.errCode === 0) {
        toast.success("Cập nhật người dùng thành công!");
        dispatch(editUserSuccess());
        dispatch(getAllUsers());
      } else {
        toast.error("Cập nhật người dùng thất bại!");
        dispatch(editUserFailed());
      }
    } catch (e) {
      dispatch(editUserFailed());
      console.log("deleteUserFailed Error", e);
    }
  };
};

export const editUserSuccess = () => ({
  type: actionTypes.EDIT_USER_SUCCESS,
});

export const editUserFailed = () => ({
  type: actionTypes.EDIT_USER_FAILED,
});

//fetch top doctor
export const fetchTopDoctor = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getTopDoctorHomeService();
      console.log("actions admin res ==========", res.data);

      if (res && res.errCode === 0) {
        dispatch(fetchTopDoctorSuccess(res.data));
      } else {
        dispatch(fetchTopDoctorFailed());
      }
    } catch (e) {
      dispatch(fetchTopDoctorFailed());
      console.log("fetchTopDoctorFailed Error", e);
    }
  };
};

export const fetchTopDoctorSuccess = (data) => ({
  type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
  data: data,
});

export const fetchTopDoctorFailed = () => ({
  type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
});

//fetch all doctor
export const fetchAllDoctor = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllDoctorService();
      // console.log("actions admin res ==========", res.data);

      if (res && res.errCode === 0) {
        dispatch(fetchAllDoctorSuccess(res.data));
      } else {
        dispatch(fetchAllDoctorFailed());
      }
    } catch (e) {
      dispatch(fetchAllDoctorFailed());
      console.log("fetchAllDoctorFailed Error", e);
    }
  };
};

export const fetchAllDoctorSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
  data: data,
});

export const fetchAllDoctorFailed = () => ({
  type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
});

//create markdown doctor
export const saveInfoDoctor = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await saveInfoDoctorService(data);
      if (res && res.errCode === 0) {
        toast.success("Lưu thông tin thành công!");
        dispatch({
          type: actionTypes.CREATE_INFO_DOCTOR_SUCCESS,
        });
      } else {
        console.log("error", res);
        toast.error("Lưu thông tin thất bại!");
        dispatch({
          type: actionTypes.CREATE_INFO_DOCTOR_FAILED,
        });
      }
    } catch (e) {
      toast.error("Lưu thông tin Bác sĩ thất bại!");

      dispatch({
        type: actionTypes.CREATE_INFO_DOCTOR_FAILED,
      });
    }
  };
};

//fetch chedule hours
export const fetchCheduleHours = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("TIME");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_CHEDULE_HOURS_SUCCESS,
          data: res.data,
        });
      } else {
        console.log("error", res);
        dispatch({
          type: actionTypes.FETCH_CHEDULE_HOURS_FAILED,
        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_CHEDULE_HOURS_FAILED,
      });
    }
  };
};

//fetch doctor_info price
export const fetchDoctorInfoPrive = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("PRICE");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_DOCTOR_INFO_PRICE_SUCCESS,
          data: res.data,
        });
      } else {
        console.log("error", res);
        dispatch({
          type: actionTypes.FETCH_DOCTOR_INFO_PRICE_FAILED,
        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_DOCTOR_INFO_PRICE_FAILED,
      });
    }
  };
};

//fetch doctor_info payment
export const fetchDoctorInfoPayment = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("PAYMENT");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_DOCTOR_INFO_PAYMENT_SUCCESS,
          data: res.data,
        });
      } else {
        console.log("error", res);
        dispatch({
          type: actionTypes.FETCH_DOCTOR_INFO_PAYMENT_FAILED,
        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_DOCTOR_INFO_PAYMENT_FAILED,
      });
    }
  };
};

//fetch doctor_info province
export const fetchDoctorInfoProvine = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("PROVINCE");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_DOCTOR_INFO_PROVINCE_SUCCESS,
          data: res.data,
        });
      } else {
        console.log("error", res);
        dispatch({
          type: actionTypes.FETCH_DOCTOR_INFO_PROVINCE_FAILED,
        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_DOCTOR_INFO_PROVINCE_FAILED,
      });
    }
  };
};

//fetch specialty
export const fetchSpecialty = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getSpecialtyHomeService();
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_SPECIALTY_SUCCESS,
          data: res.data,
        });
      } else {
        console.log("error", res);
        dispatch({
          type: actionTypes.FETCH_SPECIALTY_FAILED,
        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_SPECIALTY_FAILED,
      });
    }
  };
};

//fetch clinic
export const fetchClinic = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getClinicHomeService();
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_CLINIC_SUCCESS,
          data: res.data,
        });
        // console.log("fetchClinic", res.data);
      } else {
        console.log("error", res);
        dispatch({
          type: actionTypes.FETCH_CLINIC_FAILED,
        });
      }
    } catch (e) {
      dispatch({
        type: actionTypes.FETCH_CLINIC_FAILED,
      });
    }
  };
};
