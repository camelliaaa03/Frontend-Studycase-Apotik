import React, { useEffect } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { logout } from "@/actions/auth";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};
const dispatch = useDispatch();

const AuthVerify = (props) => {
  let location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      const decodedJwt = parseJwt(user.accessToken);

      if (decodedJwt.exp * 1000 < Date.now()) {
        // props.logOut();
        dispatch(logout());
        localStorage.removeItem("user");
      }
    }
  }, [location, props]);

  if (!localStorage.getItem("user")) {
    // Pengguna tidak memiliki data pengguna di penyimpanan lokal, diarahkan ke halaman login
    return <Redirect to="/auth/sign-in" />;
  }

  return <div></div>;
};

export default AuthVerify;
