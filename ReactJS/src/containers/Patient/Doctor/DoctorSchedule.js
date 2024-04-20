import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import Select from "react-select";
import moment from "moment";
import localization from "moment/locale/vi";
import { getScheduleByDateService } from "../../../services/userService";
import BookingModal from "./Modal/BookingModal";
class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDate: [],
      allValuetime: [],
      isModalBooking: false,
      dataTimeParent: {},
    };
  }

  componentDidMount() {
    let arrAll = this.setArrDate();
    this.setState({
      allDate: arrAll,
    });
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.doctorId != prevProps.doctorId) {
      let allDate = this.setArrDate();
      let res = await getScheduleByDateService(
        this.props.doctorId,
        allDate[0].value
      );
      this.setState({
        allValuetime: res.data ? res.data : [],
      });
    }
  }

  setArrDate = () => {
    let allDate = [];
    let today = moment().startOf("day");

    for (let i = 0; i < 7; i++) {
      let object = {};
      let currentDate = moment().add(i, "days").startOf("day");

      let dayLabel = "";

      if (currentDate.isSame(today)) {
        dayLabel = "Hôm nay";
      } else {
        dayLabel = currentDate.format("dddd");
      }

      dayLabel += " - " + currentDate.format("DD/MM");

      dayLabel = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);

      object.label = dayLabel;
      object.value = currentDate.valueOf();
      allDate.push(object);
    }
    return allDate;
  };

  handleOnchangeSelect = async (e) => {
    let doctorId = this.props.doctorId;
    let date = parseInt(e.target.value);

    console.log(doctorId, date);

    let res = await getScheduleByDateService(doctorId, date);
    if (res && res.errCode === 0) {
      this.setState({
        allValuetime: res.data ? res.data : [],
      });
    }

    console.log("=====onchanges", res.data);
  };

  handleClickModalBooking = (time) => {
    this.setState({
      isModalBooking: true,
      dataTimeParent: time,
    });
    console.log(time);
  };

  closeModalBooking = () => {
    this.setState({
      isModalBooking: false,
    });
  };

  render() {
    let { allDate, allValuetime } = this.state;
    console.log(allDate);
    return (
      <>
        <div className="schedule-container">
          <div>
            <select
              className="select-day"
              onChange={(e) => {
                this.handleOnchangeSelect(e);
              }}
            >
              {allDate &&
                allDate.length > 0 &&
                allDate.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="all-time">
            <div className="bg-textTime">
              <div>
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div>LỊCH KHÁM</div>
            </div>

            <div className="bg-item-container">
              {allValuetime && allValuetime.length > 0 ? (
                allValuetime.map((item, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className="btn-time"
                        onClick={() => {
                          this.handleClickModalBooking(item);
                        }}
                      >
                        <button key={index}>{item.timeTypeDate.valueVi}</button>
                      </div>
                    </>
                  );
                })
              ) : (
                <p className="warning">
                  Hiện tại, bác sĩ không có khoảng thời gian khám này!
                </p>
              )}
            </div>

            {allValuetime && allValuetime.length > 0 ? (
              <div className="text-choose">
                Chọn <i className="far fa-hand-point-up"></i> và đặt miễn phí
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* modal booking */}
        <BookingModal
          isModalBooking={this.state.isModalBooking}
          closeModalBooking={this.closeModalBooking}
          dataTimeParent={this.state.dataTimeParent}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
