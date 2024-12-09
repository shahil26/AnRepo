/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGIN_SUCCESS, LOGIN_FAILURE } from "../../redux/actions/types";
import authService from "../../services/authService";
import {
  loadCaptchaEnginge,
  validateCaptcha,
  LoadCanvasTemplateNoReload,
} from "react-simple-captcha";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { CgClose } from "react-icons/cg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [instituteId, setInstituteId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [isGuidelinesAccepted, setIsGuidelinesAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    loadCaptchaEnginge(6);
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateCaptcha(userCaptcha)) {
      setMessage("Invalid captcha code");
      return;
    }
    try {
      const response = await authService.login(instituteId, email, password);
      const payload = {
        instituteId: instituteId,
        email: email,
        token: response.token,
        roles: response.roles,
        name: response.name,
        image: response.image,
        keepunsaved: response.unsaved,
      };
      dispatch({ type: LOGIN_SUCCESS, payload: payload });
      setMessage("Login successful! Redirecting to the dashboard...");
    } catch (error) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: error.response?.data?.message || error?.message || error,
      });
      setMessage("Login failed");
    }
  };
  const GuidelinesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg m-5 overflow-y-auto max-h-full">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-4">Usage Guidelines</h2>
            <CgClose
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-red-200 p-[2px]"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">GDPR Guidelines</h3>
            <p>
              The General Data Protection Regulation (GDPR) is a regulation in
              EU law on data protection and privacy in the European Union and
              the European Economic Area. It also addresses the transfer of
              personal data outside the EU and EEA areas. The GDPR aims
              primarily to give control to individuals over their personal data
              and to simplify the regulatory environment for international
              business by unifying the regulation within the EU.
            </p>
            <h3 className="text-lg font-semibold mb-2 mt-4">
              FERPA Guidelines
            </h3>
            <p>
              The Family Educational Rights and Privacy Act (FERPA) is a federal
              law that protects the privacy of student education records. The
              law applies to all schools that receive funds under an applicable
              program of the U.S. Department of Education. FERPA gives parents
              certain rights with respect to their children&apos;s education
              records. These rights transfer to the student when he or she
              reaches the age of 18 or attends a school beyond the high school
              level.
            </p>
            <h3 className="text-lg font-semibold mb-2 mt-4">
              Terms and Conditions
            </h3>
            <p>
              By accessing or using our services, you agree to be bound by these
              terms and conditions. If you disagree with any part of the terms,
              then you may not access the service. We reserve the right to
              modify or replace these terms at any time. Your continued use of
              the service after any such changes constitutes your acceptance of
              the new terms.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
          {/* Left Side */}
          <div className="md:block w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex items-center justify-center">
            <div className="text-white text-center dark:text-red-900">
              <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
              <p className="sm:text-lg text-md">
                Login with your institute credentials and access all the
                resources.
              </p>
              <img src="/logo.png" alt="img" className="hidden md:block mt-8" />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="sm:text-3xl text-lg font-bold text-center text-gray-800 mb-6">
              Login to Your Account
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="instituteId"
                  value={instituteId}
                  onChange={(e) => setInstituteId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your institute ID"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  id="emailId"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email ID"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="captcha-container flex flex-col items-center space-y-3 my-4">
                <div className="w-full justify-between flex items-center border-2 gap-2 pt-1">
                  <LoadCanvasTemplateNoReload />
                  <button
                    type="button"
                    onClick={() => loadCaptchaEnginge(6)}
                    className="p-2 text-black hover:text-blue-500 transition-colors"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter Captcha"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center justify-between gap-1">
                <a
                  href="/create-password"
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Create Password
                </a>
                <a
                  href="/forgot-password"
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Forgot Password
                </a>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="guidelines"
                  checked={isGuidelinesAccepted}
                  onChange={(e) => setIsGuidelinesAccepted(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="guidelines" className="text-sm text-gray-600">
                  I accept the{"   "}
                  <button
                    type="button"
                    onClick={() => setShowGuidelinesModal(true)}
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    usage guidelines
                  </button>
                </label>
              </div>

              {/* Add modal at the bottom of the component */}
              <GuidelinesModal
                isOpen={showGuidelinesModal}
                onClose={() => setShowGuidelinesModal(false)}
              />
              <div>
                <button
                  type="submit"
                  disabled={!isGuidelinesAccepted}
                  className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg 
    transition duration-300
    enabled:hover:bg-blue-600 
    disabled:bg-gray-900 
    disabled:cursor-not-allowed 
    disabled:opacity-50"
                >
                  Login
                </button>
                {message && (
                  <p className="text-center text-green-500 py-2">{message}</p>
                )}
                {error && (
                  <p className="text-center text-red-500 py-2">{error}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
