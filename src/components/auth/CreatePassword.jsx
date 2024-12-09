import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CREATE_PASSWORD_FAILURE,
  CREATE_PASSWORD_SUCCESS,
  OTP_FAILURE,
  OTP_SENT,
} from "../../redux/actions/types";
import authService from "../../services/authService";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const CreatePassword = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [email, setEmail] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();

  // Redirect to dashboard if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Handle email OTP submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.sendOtp(email, instituteId);
      dispatch({ type: OTP_SENT });
      setStep(2);
      setMessage("OTP sent to your email");
    } catch (error) {
      dispatch({
        type: OTP_FAILURE,
        payload: error.response?.data?.message || "Error in sending OTP",
      });
      setMessage("Failed to send OTP");
    }
  };

  // Handle OTP verification and password creation
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      try {
        await authService.verifyOtp(instituteId, email, otp, newPassword);
        dispatch({ type: CREATE_PASSWORD_SUCCESS });
        setMessage("Password created successfully");
        navigate("/login");
      } catch (error) {
        dispatch({
          type: CREATE_PASSWORD_FAILURE,
          payload: error.response?.data?.message || "Error creating password",
        });
        setMessage("Password creation failed");
      }
    } else {
      setMessage("Passwords do not match");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
          {/* Left Side */}
          <div className="md:block w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-4xl font-bold mb-6">Get Your Password!</h2>
              <p className="sm:text-lg text-md">
                Create a fresh password to begin.
              </p>
              <img src="/logo.png" alt="img" className="hidden md:block mt-8" />
            </div>
          </div>
          <div className="w-full md:w-1/2 p-8">
            {/* Step 1: Enter email to receive OTP */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <h2 className="sm:text-3xl text-lg font-bold text-center text-gray-800 mb-6">
                  Create New Password
                </h2>
                <input
                  type="text"
                  id="instituteId"
                  value={instituteId}
                  onChange={(e) => setInstituteId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your institute ID"
                  required
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  placeholder="Enter your email"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg"
                >
                  Send OTP
                </button>
                {message && <p className="text-green-500 mt-2">{message}</p>}
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </form>
            )}

            {/* Step 2: Enter OTP and set new password */}
            {step === 2 && (
              <form onSubmit={handleOtpSubmit}>
                <h2 className="text-3xl font-bold text-center text-gray-800">
                  Verify OTP and Set New Password
                </h2>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  placeholder="Enter the OTP"
                  required
                />
                <div className="relative mb-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                    required
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
                <div className="relative mb-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg"
                >
                  Submit
                </button>
                {message && <p className="text-green-500 mt-2">{message}</p>}
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </form>
            )}

            <div className="flex items-center justify-between py-2 gap-1">
              <a
                href="/login"
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Login
              </a>
              <a
                href="/forgot-password"
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Forgot Password
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePassword;
