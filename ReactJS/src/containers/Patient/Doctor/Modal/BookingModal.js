import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ModalBody,
  ModalFooter,
  ModalHeader,
  Modal,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import "./BookingModal.scss";
import ProfileDoctor from "../ProfileDoctor";
import moment from "moment";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import _ from "lodash";
import { addBookingPatientService } from "../../../../services/userService";
import { toast } from "react-toastify";
class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      gender: "",
      genderArr: [],
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthDay: "",
      doctorId: "",
      timeType: "",
      isConfirming: false,
    };
  }

  componentDidMount() {
    this.props.getGenderStart();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const gender = this.props.genderRedux;

    if (prevProps.genderRedux !== this.props.genderRedux) {
      this.setState({
        genderArr: gender,
        gender: gender && gender.length > 0 ? gender[0].key : "",
      });
    }

    if (this.props.dataTimeParent !== prevProps.dataTimeParent) {
      if (this.props.dataTimeParent && !_.isEmpty(this.props.dataTimeParent)) {
        this.setState({
          doctorId: this.props.dataTimeParent.doctorId,
          timeType: this.props.dataTimeParent.timeType,
        });
      }
    }
  }

  handleInputChange = (e, id) => {
    let valueInput = e.target.value;

    let copyState = { ...this.state };
    copyState[id] = valueInput;
    this.setState({
      ...copyState,
    });
  };

  handleOnchangeDatePicker = (date) => {
    this.setState({
      birthDay: date[0],
    });
  };

  handleConfirmBooking = async () => {
    this.setState({ isConfirming: true });
    let date = new Date(this.state.birthDay).getTime();
    let res = await addBookingPatientService({
      fullName: this.state.fullName,
      gender: this.state.gender,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      date: date,
      doctorId: this.state.doctorId,
      timeType: this.state.timeType,

      days: this.props.dataDateParent,
      time: this.props.dataTimeParent.timeTypeDate.valueVi,
      nameDoctor: this.props.nameDoctor,
      languageParent: this.props.languageParent,
      // linkRedireact: "https://www.youtube.com/",
    });
    this.setState({ isConfirming: false });
    if (res && res.errCode === 0) {
      toast.success("Đăng ký khám thành công!");
      console.log("Booking confirmed with data:", this.state);
      this.props.closeModalBooking();
      this.setState({
        fullName: "",
        gender: "",
        phoneNumber: "",
        email: "",
        address: "",
        reason: "",
        date: "",
      });
    } else {
      toast.error("Đăng ký khám thất bại!");
      this.props.closeModalBooking();
    }
  };

  render() {
    let { closeModalBooking, isModalBooking, dataTimeParent, dataDateParent } =
      this.props;

    // console.log("!!!!!!!!!", this.props.nameDoctor);
    const genderInfo = this.state.genderArr;

    return (
      <Modal
        toggle={closeModalBooking}
        isOpen={isModalBooking}
        className={"custom-modal"}
        centered
      >
        <ModalHeader>THÔNG TIN ĐẶT LỊCH KHÁM</ModalHeader>
        <ProfileDoctor doctorId={dataTimeParent.doctorId} />
        <div className="time-modal">
          Thời gian khám:{" "}
          <span className="time">
            ({dataDateParent}) ~ (
            {dataTimeParent &&
            dataTimeParent.timeTypeDate &&
            dataTimeParent.timeTypeDate.valueVi
              ? dataTimeParent.timeTypeDate.valueVi
              : ""}
            )
          </span>
        </div>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <FormGroup className="form-group-input">
                <Label for="fullName">Họ và tên</Label>
                <Input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={this.state.fullName}
                  onChange={(e) => {
                    this.handleInputChange(e, "fullName");
                  }}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup className="form-group-input">
                <Label for="gender">Giới tính</Label>

                <Input
                  type="select"
                  name="gender"
                  id="gender"
                  value={this.state.gender}
                  onChange={(e) => {
                    this.handleInputChange(e, "gender");
                  }}
                >
                  {genderInfo &&
                    genderInfo.length > 0 &&
                    genderInfo.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {item.valueVi}
                        </option>
                      );
                    })}
                </Input>
              </FormGroup>
            </div>
          </div>
          <FormGroup className="form-group-input">
            <Label for="phoneNumber">Số điện thoại</Label>
            <Input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              value={this.state.phoneNumber}
              onChange={(e) => {
                this.handleInputChange(e, "phoneNumber");
              }}
            />
          </FormGroup>
          <FormGroup className="form-group-input">
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={this.state.email}
              onChange={(e) => {
                this.handleInputChange(e, "email");
              }}
            />
          </FormGroup>
          <FormGroup className="form-group-input">
            <Label for="address">Địa chỉ</Label>
            <Input
              type="text"
              name="address"
              id="address"
              value={this.state.address}
              onChange={(e) => {
                this.handleInputChange(e, "address");
              }}
            />
          </FormGroup>
          <FormGroup className="form-group-input">
            <Label for="reason">Lý do khám</Label>
            <Input
              type="text"
              name="reason"
              id="reason"
              value={this.state.reason}
              onChange={(e) => {
                this.handleInputChange(e, "reason");
              }}
            />
          </FormGroup>
          <FormGroup className="form-group-input input-birthday">
            <Label for="birthDay">Ngày sinh</Label>
            <DatePicker
              onChange={this.handleOnchangeDatePicker}
              value={this.state.birthDay}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          {this.state.isConfirming ? (
            <div className="loader"></div>
          ) : (
            <>
              <Button
                className="btn-apply"
                onClick={() => {
                  this.handleConfirmBooking();
                }}
              >
                Xác nhận
              </Button>{" "}
              <Button className="btn-cancel" onClick={closeModalBooking}>
                Trở lại
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return { genderRedux: state.admin.genders };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
