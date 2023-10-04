import axios1 from "axios";

export const constants = {
  baseURL: "https://ad/api/",
};
export const axios = axios1.create({
  baseURL: "",
  timeout: 30000,
  headers: { "Content-Type": "application/json",
  Accept: 'application/json',
  'Access-Control-Allow-Origin': '*', },
});
export const multiPartAxios = axios1.create({
  baseURL: "",
  timeout: 30000,
  headers: { "Content-Type": "multipart/form-data",
  Accept: 'multipart/form-data',
  'Access-Control-Allow-Origin': '*', },
});
axios.interceptors.request.use(
  async function (_config) {
    return _config;
  },
  function (err) {
    console.log("error due to  no internet", err);
    return Promise.reject(err);
  }
);

axios.defaults.timeout = 30000;
