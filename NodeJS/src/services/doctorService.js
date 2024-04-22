import _ from "lodash";
import db from "../models/index";

let getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    limit = parseInt(limit);
    try {
      let users = await db.User.findAll({
        limit: limit,
        where: {
          roleId: "R2",
        },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        // raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctorService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.User.findAll({
        where: {
          roleId: "R2",
        },
        attributes: {
          exclude: ["password", "image"],
        },
      });

      resolve({
        errCode: 0,
        data: doctor,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let saveInfoDoctorService = (input) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !input.doctorId ||
        !input.contentHTML ||
        !input.contentMarkDown ||
        !input.action
        // !input.selectPrice ||
        // !input.selectPayment ||
        // !input.selectProvince ||
        // !input.nameClinic ||
        // !input.addressClinic ||
        // !input.note
      ) {
        console.log("erorr ==== input");
        resolve({
          errCode: 1,
          errMassage: "Error input!!!",
        });
      } else {
        //upsert markdown
        if (input.action === "CREATE") {
          await db.MarkDown.create({
            contentHTML: input.contentHTML,
            contentMarkDown: input.contentMarkDown,
            description: input.description,
            doctorId: input.doctorId,
          });
          resolve({
            errCode: 0,
            errMassage: "Create doctor-markdown success!!",
          });
        } else if (input.action === "EDIT") {
          let doctorById = await db.MarkDown.findOne({
            where: { doctorId: input.doctorId },
            // raw: true,
          });

          if (doctorById) {
            doctorById.contentHTML = input.contentHTML;
            doctorById.contentMarkDown = input.contentMarkDown;
            doctorById.description = input.description;

            await doctorById.save();
            // console.log("=======");
            resolve({
              errCode: 0,
              errMassage: "Update info doctor-markdown success!!",
            });
          }
        }
        //upsert doctor_info
        let doctorInfo = await db.Doctor_Info.findOne({
          where: { doctorId: input.doctorId },
        });

        if (doctorInfo) {
          //update doctor-info
          doctorInfo.priceId = input.selectPrice;
          doctorInfo.paymentId = input.selectPayment;
          doctorInfo.provinceId = input.selectProvince;
          doctorInfo.nameClinic = input.nameClinic;
          doctorInfo.addressClinic = input.addressClinic;
          doctorInfo.note = input.note;

          await doctorInfo.save();
          // console.log("=======");
          resolve({
            errCode: 0,
            errMassage: "Update info doctor-info success!!",
          });
        } else {
          //create doctor-info
          await db.Doctor_Info.create({
            doctorId: input.doctorId,
            priceId: input.selectPrice,
            paymentId: input.selectPayment,
            provinceId: input.selectProvince,
            nameClinic: input.nameClinic,
            addressClinic: input.addressClinic,
            note: input.note,
          });
          resolve({
            errCode: 0,
            errMassage: "Create doctor-info success!!",
          });
        }
      }
    } catch (e) {
      console.log("error", e);

      reject(e);
    }
  });
};

let getDetailDoctorByIdService = (idDoctor) => {
  return new Promise(async (resvole, reject) => {
    try {
      if (!idDoctor) {
        resvole({
          errCode: 1,
          errMassage: "Lỗi input !!",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: idDoctor },
          attributes: {
            exclude: ["password"],
          },
          include: [
            //markdown
            {
              model: db.MarkDown,
              attributes: {
                exclude: ["createdAt", "updatedAt", "clinicId", "specialtyId"],
              },
            },
            //allcode
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },

            //doctor-info
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["createdAt", "updatedAt", "doctorId"],
              },

              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        resvole({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let createScheduleService = (data) => {
  return new Promise(async (resvole, reject) => {
    try {
      if (!data) {
        resvole({
          errCode: 1,
          errMassage: "Vui lòng điền thông tin!",
        });
      } else {
        let schedule = data.arrSchedule;
        // console.log(schedule);
        schedule = schedule.map((item) => {
          item.maxNumber = 10;
          item.date = new Date(item.date).getTime();
          return item;
        });
        console.log("schedule===========1111111111", schedule);

        let doctorId = data.doctorId;
        let date = new Date(data.date).getTime();
        // console.log("============================date====", doctorId, date);

        let existing = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          attributes: ["doctorId", "date", "timeType", "maxNumber"],
          raw: true,
        });
        console.log("existing===========2222222222", existing);

        //convert date
        if (existing && existing.length > 0) {
          existing = existing.map((item) => {
            item.date = new Date(item.date).getTime();
            console.log("ifffffexisting");
            return item;
          });
        }
        //compare
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType;
          // && a.date === b.date;
        });
        console.log("toCreate===========", toCreate);

        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        resvole({
          errCode: 0,
          errMassage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getScheduleByDateService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMassage: "Thiếu dữ liệu !!",
        });
      } else {
        let data = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          include: [
            //allcode
            {
              model: db.Allcode,
              as: "timeTypeDate",
              attributes: ["valueEn", "valueVi"],
            },

            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          nest: true,
        });

        if (!data) data = [];

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getDoctorExtraInfoService = (idDoctor) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idDoctor) {
        resolve({
          errCode: 1,
          errMassage: "Không tìm thấy id!!!",
          data: {},
        });
      } else {
        let dataExtraDoctor = await db.Doctor_Info.findOne({
          where: { doctorId: idDoctor },

          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],

          nest: true,
        });

        console.log("========", dataExtraDoctor);

        resolve({
          errCode: 0,
          errMassage: "OK",
          data: dataExtraDoctor,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getProfileDoctorService = (idDoctor) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idDoctor) {
        resolve({
          errCode: 1,
          errMassage: "Không tìm thấy id!!!",
          data: {},
        });
      } else {
        let data = await db.User.findOne({
          where: { id: idDoctor },
          attributes: {
            exclude: ["password"],
          },
          include: [
            //allcode
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },

            //doctor-info
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["createdAt", "updatedAt", "doctorId"],
              },

              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          nest: true,
        });

        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctorService: getAllDoctorService,
  saveInfoDoctorService: saveInfoDoctorService,
  getDetailDoctorByIdService: getDetailDoctorByIdService,
  createScheduleService: createScheduleService,
  getScheduleByDateService: getScheduleByDateService,
  getDoctorExtraInfoService: getDoctorExtraInfoService,
  getProfileDoctorService: getProfileDoctorService,
};
