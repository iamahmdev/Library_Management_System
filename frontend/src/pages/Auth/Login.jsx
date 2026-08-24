import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosInstance } from "../../utils/AxiosInstance";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { loading, setLoading, user, setUser, navigate } =
    useContext(AppContext);

  const [formdata, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!formdata.email || !formdata.password) {
      toast.error("Please fill all fields");
      return;
    }

    if (!formdata.email.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);

      const { data } = await AxiosInstance.post("/api/auth/login", formdata);

      if (data.success) {
        toast.success(data.message);
        
        // Save token to localStorage for cross-domain auth
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        setUser(data.user);

        // Redirect based on user role
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/student");
        }
      }

    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Login failed");
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
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
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

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                >
                  Forgot Password?
                </Link>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                value={formdata.password}
                onChange={handleChange}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />

              <label
                htmlFor="remember"
                className="ml-2 text-sm text-slate-600"
              >
                Remember me
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit" disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.99]"
            >
              {loading? "please wait.." : "Sign In"}
            </button>

          </form>

          {/* Sign Up */}
          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Sign Up
              </Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Secure access to your Library Management System
        </p>

      </div>
    </div>
  );
};

export default Login;