import { useDispatch } from "react-redux";
import { loginRequest } from "../actions/authentication";


export default function useLogin() {
  const dispatch = useDispatch();
  
  return async (email, password) => {
    const f = loginRequest(email, password);
    const response = await f(dispatch);
    
    if (response.status === "SUCCESS") {
      let domainIndex = window.location.hostname.indexOf('.') // ex) asdf.good.com -> 5 (.의 위치)
      let domainName
      if (domainIndex === -1) domainName = window.location.hostname // .을 못 찾은 경우 그대로 씀 -> localhost
      else domainName = window.location.hostname.substr(domainIndex) // .이 있는 경우 -> .good.com
      // create session data
      let loginData = {
        isLoggedIn: true,
        email: email
      };

      document.cookie = 'key=' + btoa(JSON.stringify(loginData)) + ';domain=' + domainName + ';path=/;';

      if (!navigator.cookieEnabled) return { success: true, error: 92 }

      return { success: true };
    } else {
      return { success: false, error: response.error }
    }
  }
}