import { checkInvalidation } from "../../../6733169821_Software_Testing_MidtermExam/utils/formHelper";

const today = new Date();

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

export const testData = {
  validData: {
    //Tommorow's date in YYYY-MM-DD format
    date: tomorrowStr,
    time: "18:00",
    guests: "4"
  },

  invalidData: {
    //Yesterdays date in YYYY-MM-DD format
    date: yesterdayStr, 
    time: "25:00",
    guests: "-1"
  },

  manualReservationData: {
    table: "T-02",
    guests: "4"
  },

  maxGuestsData: 10, 
  MinGuestsData: 1,
  ExceedMaxGuestsData: 11,

  thisSlot: "18:00",
  nextSlot: "19:00",
  
  bva_lateCancel_14m59s: `${tomorrowStr}T18:14:59`,
  bva_lateCancel_15m00s: `${tomorrowStr}T18:15:00`,
  
  checkInTime_5m: `${tomorrowStr}T18:05:00`,
  checkInTime_6m: `${tomorrowStr}T18:06:00`,
  reservationId: "RES12345"
};