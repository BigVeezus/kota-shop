// import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import toast from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginUser = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate form data
    if (form.email === "" || form.password === "") {
      toast.error("To login user, enter details to proceed...");
      return; // Prevent API call if validation fails
    }

    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success("Login Successful");

          // Store user data and token in localStorage
          localStorage.setItem("user", JSON.stringify(data.data));
          localStorage.setItem("token", data.token);

          // Sign in and navigate to the home page
          authContext.signin(data.data._id, () => {
            navigate("/");
          });
        } else {
          toast.error("Wrong credentials, Try again");
        }
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again.");
        console.log("Something went wrong", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen  items-center place-items-center">
        <div className="flex justify-center">
          <img src={require("../assets/login.jpg")} alt="" />
        </div>
        <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={require("../assets/logo.png")}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            {/* <p className="mt-2 text-center text-sm text-gray-600">
              Or
              <span
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                start your 14-day free trial
              </span>
            </p> */}
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* <input type="hidden" name="remember" defaultValue="true" /> */}
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={loginUser}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  /> */}
                </span>
                Sign in
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  Don't Have an Account, Please{" "}
                  <Link to="/register"> Register now </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
