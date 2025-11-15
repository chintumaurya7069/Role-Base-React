import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { loginWithEmail } from "../../../services/authentication/login";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters")
      .required("Password is required"),
  });

  const navigate = useNavigate();
  useEffect(() => {
    const authToken = localStorage.getItem("auth_token");
    if (authToken) {
      navigate("/");
    }
  }, []);


  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoginError("");
      const response = await loginWithEmail(values);
      if (
        response.success ||
        response.status === 200 ||
        response.status === 201
      ) {
        if (response.data?.token) {
          localStorage.setItem("auth_token", response.data.token);
        }
        navigate("/admin");
      } else {
        setLoginError(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setLoginError(
        error.response?.data?.message ||
          "An error occurred during login. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="light-style layout-wide customizer-hide">
      <div className="authentication-wrapper authentication-cover authentication-bg">
        <div className="authentication-inner row">
          {/* /Left Text */}
          <div className="d-none d-lg-flex col-lg-7 p-0">
            <div className="auth-cover-bg auth-cover-bg-color d-flex justify-content-center align-items-center">
              <img
                src={require("../../../assets/img/illustrations/auth-login-illustration-light.png")}
                alt="auth-login-cover"
                className="img-fluid my-5 auth-illustration"
              />
              <img
                src={require("../../../assets/img/illustrations/bg-shape-image-light.png")}
                alt="auth-login-cover"
                className="platform-bg"
                data-app-light-img="illustrations/bg-shape-image-light.png"
                data-app-dark-img="illustrations/bg-shape-image-dark.html"
              />
            </div>
          </div>
          {/* /Left Text */}

          {/* Login */}
          <div className="d-flex col-12 col-lg-5 align-items-center p-sm-5 p-4">
            <div className="w-px-400 mx-auto">
              {/* /Logo */}
              <h3 className="mb-1">Welcome 👋</h3>
              {loginError && (
                <div className="alert alert-danger mb-3">{loginError}</div>
              )}

              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, handleChange, isSubmitting, errors, touched }) => (
                  <Form className="w-100">
                    {/* Email Field */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          touched.email && errors.email ? "is-invalid" : ""
                        }`}
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        autoFocus
                        value={values.email}
                      />
                      {touched.email && errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-3 form-password-toggle">
                      <div className="d-flex justify-content-between">
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                      </div>
                      <div className="input-group input-group-merge">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className={`form-control ${
                            touched.password && errors.password
                              ? "is-invalid"
                              : ""
                          }`}
                          name="password"
                          placeholder="············"
                          aria-describedby="password"
                          onChange={handleChange}
                          value={values.password}
                        />
                        <span
                          className="input-group-text cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i
                            className={`ti ti-eye${showPassword ? "" : "-off"}`}
                          />
                        </span>
                        {touched.password && errors.password && (
                          <div className="invalid-feedback">
                            {errors.password}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="remember-me"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="remember-me"
                        >
                          Remember Me
                        </label>
                      </div>
                    </div>

                    {/* Sign-in Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      className="btn btn-primary d-grid w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in..." : "Sign in"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          {/* /Login */}
        </div>
      </div>
    </div>
  );
};

export default Login;