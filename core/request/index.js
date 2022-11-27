import axios from 'axios'
import setJwtHeaders from './setJwtHeaders'
const fetchData = async (URL, jwt) => {
  return (await axios.get(URL, setJwtHeaders(jwt)
  )).data
}
const fetchDetail = async (URL, jwt, id) => {
  return (await axios.get(`${URL}/${id}`, setJwtHeaders(jwt)
  )).data
}
const postDataWithFile = (URL, axios, jwt, payload) => {
  const formData = new FormData()
  // formData.append('file', file)
  for (const key in payload) {
    formData.append(key, payload[key])
  }
  return axios.post(
        `${URL}`,
        formData,
        setJwtHeaders(jwt)
  )
}
const uploadFile = (URL, axios, jwt, file) => {
  // eslint-disable-next-line prefer-const
  let formData = new FormData()
  formData.append('file', file)
  return axios.post(
    `${URL}`,
    formData,
    setJwtHeaders(jwt)
  )
}
const exportData = async (URL, jwt) => await axios.get(URL, {
  responseType: 'blob',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwt}`
  }
})
const requestCode = async (URL, payload) => (await axios.post(URL, payload)).data
const verifyCode = async (URL, payload) => (await axios.post(URL, payload)).data
const postData = async (URL, payload, jwt) => (await axios.post(URL, payload, setJwtHeaders(jwt))).data
const putData = async (URL, payload, jwt) => (await axios.put(URL, payload, setJwtHeaders(jwt))).data
const deleteData = async (URL, jwt) => (await axios.delete(URL, setJwtHeaders(jwt))).data
const getServiceFee = async (URL, jwt) => (await axios.get(URL, setJwtHeaders(jwt))).data
const Login = async (URL, payload) => (await axios.post(URL, payload)).data
const Logout = async (URL, jwt) => (await axios.get(URL, setJwtHeaders(jwt))).data
export default {
  requestCode,
  verifyCode,
  Login,
  Logout,
  fetchData,
  fetchDetail,
  postData,
  putData,
  deleteData,
  getServiceFee,
  postDataWithFile,
  uploadFile,
  exportData
}
