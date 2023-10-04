import { axios, constants, multiPartAxios } from "../Config";
class GeneralApiFetch {
  getTermsAndConditions() {
    const reponse = axios
      .get(`${constants.baseURL}get-cms-terms-and-condition`)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return {};
      });
    return reponse;
  }
  getPrivacyPolicy() {
    const reponse = axios
      .get(`${constants.baseURL}get-cms-privacy-policy`)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return {};
      });
    return reponse;
  }

  getTestimonials() {
    const reponse = axios
      .get(`${constants.baseURL}get-testimonials`)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return {};
      });
    return reponse;
  }

  getLeadershipTeams() {
    const reponse = axios
      .get(`${constants.baseURL}get-leadership-team`)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return {};
      });
    return reponse;
  }
  getAboutUs() {
    const reponse = axios
      .get(`${constants.baseURL}get-cms-about-us`)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return {};
      });
    return reponse;
  }
  getProfessionals(payload) {
    const userdetails = JSON.parse(localStorage.getItem("userDetails"));
    let token;
    if (userdetails != null) {
      token = userdetails.api_token;
    } else {
      token = null;
    }
    const reponse = axios
      .post(`${constants.baseURL}show_professionals`, payload, {
        headers: {
          Authorization: `Bearer ${token}` ? `Bearer ${token}` : "",
        },
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return {};
      });
    return reponse;
  }
}
export default new GeneralApiFetch();
