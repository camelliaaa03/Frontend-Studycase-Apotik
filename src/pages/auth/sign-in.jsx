import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, Typography, Input } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { login } from "../../actions/auth";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const SignIn = (props) => {
  let navigate = useNavigate();

  const form = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);

    setFormSubmitted(true);

    if (form.current.checkValidity()) {
      dispatch(login(username, password))
        .then(() => {
          const user = JSON.parse(localStorage.getItem("user"));
          if (user && user.role === "kasir") {
            navigate("/dashboard/home");
          } else if (user && user.role === "admin") {
            navigate("/dashboard/home");
          } else {
            navigate("/auth/sign-in");
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      window.location.reload();
    }
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return <Navigate to="/dashboard/home" />;
  }

  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1479&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        alt="Background"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <form onSubmit={handleLogin} ref={form}>
          <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
            <CardHeader variant="gradient" color="blue" className="mb-4 grid h-28 place-items-center">
              <Typography variant="h3" color="white">
                Sign In
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  required
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  required
                  validations={[required]}
                />
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              <Button variant="gradient" fullWidth disabled={loading} type="submit">
                {loading && <span className="spinner-border spinner-border-sm"></span>}
                Sign In
              </Button>

              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
};

export default SignIn;
