import {
    axios,
    constants, multiPartAxios
} from "../Config";
import axiosGoogle from "axios";
class AuthApiFetch {
    userRegistration(payload) {
        const reponse = axios.post(
            `${constants.baseURL}user-registration`,
            payload
        )
            .then((data) => {
                return data;
            })
            .catch((error) => {
                return {};
            });
        return reponse;
    }
    forgetPasswordEmail(payload) {
        const reponse = axios.post(
            `${constants.baseURL}forget-password-email`, payload
        )
            .then((data) => {
                return data;
            })
            .catch((error) => {
                return {};
            });
        return reponse;
    }
    setNewpasswordAfterForget(payload) {
        const reponse = axios.post(
            `${constants.baseURL}forget-password-new-password`, payload
        )
            .then((data) => {
                return data;
            })
            .catch((error) => {
                return {};
            });
        return reponse;
    }
    verifyOtpForForgetPassword(payload) {
        const reponse = axios.post(
            `${constants.baseURL}forget-password-reset-code`, payload
        )
            .then((data) => {
                return data;
            })
            .catch((error) => {
                return {};
            });
        return reponse;
    }
    verifyOtp(payload) {
        const reponse = axios.post(
            `${constants.baseURL}user-login`, payload
        )
            .then((data) => {
                return data;
            })
            .catch((error) => {
                return {};
            });
        return reponse;
    }

    resendOtp(payload) {
        const reponse = axios.post(
            `${constants.baseURL}resend-otp`, payload
        )
            .then((data) => {
                return data;
            })
            .catch((error) => {
                return {};
            });
        return reponse;
    }
    login(payload) {
        const reponse = axios.post(
            `${constants.baseURL}login-existing-user`, payload
        )
            .then(({
                data
            }) => {

                return data;
            })
            .catch((error) => {
                return {};
            });
        return reponse;
    }
    socialLogin(payload) {
        const reponse = axios.post(
            `${constants.baseURL}social-login`, payload
        )
            .then(({
                data
            }) => {

                return data;
            })
            .catch((error) => {
                return {};
            });
        return reponse;
    }
    resetPassword(payload) {
        let token = JSON.parse(localStorage.getItem("userDetails")).api_token;
        const response = axios
            .post(`${constants.baseURL}user/reset_password`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                return data;
            })
            .catch((err) => {
                return {};
            });
        return response;
    }
    professionalSignUp(payload) {
        let token = JSON.parse(localStorage.getItem('userDetails')).api_token
        const reponse = multiPartAxios.post(
            `${constants.baseURL}user/professional-registration`,
            payload,
            {
                headers: { "Authorization": `Bearer ${token}` }, 'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            }
        )
            .then((data) => {
                return data;
            })
            .catch((error) => {
                return {};
            });
        return reponse;
    }
    appleSignin(payload) {
        const reponse = axios.post(
            `${constants.baseURL}apple-signin`, payload
        )
            .then(({
                data
            }) => {

                return data;
            })
            .catch((error) => {
                return {};
            });
        return reponse;
    }
    getGoogleSignProfile(payload) {
        const response = axiosGoogle
            .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${payload.access_token}`, payload, {
                headers: {
                    Authorization: `Bearer ${payload.access_token}`,
                    Accept: 'application/json'
                }
            })
            .then(({ data }) => {
                return data;
            })
            .catch((err) => {
                return {};
            });
        return response;
    }
    deleteAccount() {
        let token = JSON.parse(localStorage.getItem("userDetails")).api_token;
        const response = axios
            .get(`${constants.baseURL}user/delete_user_permentedly`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                return data;
            })
            .catch((err) => {
                return {};
            });
        return response;
    }
    disconnectSocialNetwork(payload) {
        let token = JSON.parse(localStorage.getItem("userDetails")).api_token;
        const response = axios.post(`${constants.baseURL}user/disconnect_with_social_account`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(({ data }) => {
            return data;
        }).catch((err) => {
            return {}
        })
        return response
    }




}
export default new AuthApiFetch;