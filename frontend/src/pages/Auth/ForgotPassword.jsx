import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosInstance } from "../../utils/AxiosInstance";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const { loading, setLoading, navigate } = useContext(AppContext);

  const [formdata, setFormData] = useState({
    email: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await AxiosInstance.post("/auth/forgot-password", formdata);

      if (data.success) {
        toast.success(data.message);
        // Stay on same page to show success message
        console.log("Reset email sent successfully");
      }

    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <span className="text-2xl font-bold">L</span>
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter your email to reset password
          </p>
        </div>

        {/* Forgot Password Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                value={formdata.email}
                onChange={handleChange}
              />
            </div>

            {/* Send Reset Link Button */}
            <button
              type="submit" disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.99]"
            >
              {loading? "Sending..." : "Send Reset Link"}
            </button>

          </form>

          {/* Back to Login */}
          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Back to Login
              </Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          We'll send you a password reset link
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;