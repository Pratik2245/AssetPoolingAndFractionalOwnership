"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
var CryptoJS = require("crypto-js");

const Forgot = () => {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);
  const [email, setEmail] = useState("");
  const [data, setdata] = useState({
    otp: "",
    password: "",
    cpassword: "",
  });
//   const [validotp, setvalidotp] = useState(false);
  const [encryptotp, setencryptotp] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleEmailChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };
  const handleotpChange = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let val = e.target.value;
    setdata({ ...data, [name]: val });
    console.log(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/sendEmail`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });
    const response = await res.json();
    console.log(response);
    if (response.status === 200) {
      setIsEmailSent(true);
      setencryptotp(response.otp);
      toast.success("Email sent succesfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (response.status === 201) {
      setIsEmailSent(false);
      toast.error("User not found.Please register", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (response.status === 401) {
      setIsEmailSent(false);
      toast.error("Please enter your email", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      setIsEmailSent(false);
      toast.error("Failed to send email.Try again", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const verifyotp = async (e) => {
    e.preventDefault();
    const bytes = CryptoJS.AES.decrypt(encryptotp, "secretkey123");
    const decryptotp = bytes.toString(CryptoJS.enc.Utf8);
    console.log(decryptotp,data.otp)
    if (data.otp  && data.password && data.cpassword) {
      if (
        data.password.length >= 8 &&
        data.cpassword.length >= 8 &&
        data.password == data.cpassword
      ) {
        if (decryptotp == data.otp) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/newpassword`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email:email,password:data.password}),
          });
          const response = await res.json();
          if(response.status==200){
            toast.success("Password Reseted Successfully", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            localStorage.removeItem("token")
            localStorage.removeItem("APFOS_useremail")
            router.push("/login");
          setEmail("");
          setdata({ otp: "", password: "", cpassword: "" });
        //   setvalidotp("");
          setencryptotp("");
          }else if(response.status==400){
            toast.error("User Not Found", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            router.push("/login");
          setEmail("");
          setdata({ otp: "", password: "", cpassword: "" });
        //   setvalidotp("");
          setencryptotp("");
          }else{
            toast.error("Failed to reset Password", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            router.push("/login");
          setEmail("");
          setdata({ otp: "", password: "", cpassword: "" });
        //   setvalidotp("");
          setencryptotp("");
          }
        } else {
          toast.error("Invalid OTP", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          router.push("/login");
          setEmail("");
          setdata({ otp: "", password: "", cpassword: "" });
        //   setvalidotp("");
          setencryptotp("");
        }
      } else {
        toast.error("Please Check Password Fields", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      toast.error("Please fill all fields", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 min-h-screen">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-pink-600 sm:text-3xl">
          Reset Password
        </h1>

        <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
          Reset password email was sent your email.Kindly see your email and
          reset your password
        </p>

        {!isEmailSent && (
          <form
            method="POST"
            required={true}
            className="mb-0 mt-6 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
            <p className="text-center text-lg font-medium ">Forgot Password</p>
            <input
              onChange={(e) => handleEmailChange(e)}
              type="email"
              required="true"
              className=" w-full rounded-lg border-gray-200 p-4  text-sm shadow-sm"
              placeholder="Enter your Email"
            />
            <button
              onClick={handleSubmit}
              type="submit"
              className="my-4 block w-full rounded-lg bg-pink-600 px-5 py-3 text-sm font-medium text-white"
            >
              Continue
            </button>
          </form>
        )}
        {isEmailSent && (
          <div class="flex flex-col items-center justify-center px-6 py-3 mx-auto h-fit">
            <div class="w-full p-6 bg-white rounded-lg shadow md:mt-0 sm:max-w-md  ">
              <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Change Password
              </h2>
              <form class="mt-4 space-y-4 lg:mt-5 md:space-y-5" method="POST">
                <div>
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Enter OTP
                  </label>
                  <input
                    onChange={(e) => handleotpChange(e)}
                    type="number"
                    name="otp"
                    id="otp"
                    placeholder="Enter OTP Sent to Your Email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required="true"
                  />
                </div>
                <div>
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    New Password
                  </label>
                  <input
                    onChange={(e) => handleotpChange(e)}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required="true"
                  />
                </div>
                <div>
                  <label
                    for="confirm-password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    onChange={(e) => handleotpChange(e)}
                    type="cpassword"
                    name="cpassword"
                    id="cpassword"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required="true"
                  />
                </div>
                <button
                  onClick={(e)=>verifyotp(e)}
                  type="submit"
                  class="w-full text-white bg-green-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                >
                  Reset passwod
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forgot;

//     {/* <div><p className="text-center text-lg font-medium ">Enter OTP Sent to Your Email</p>
//     <input  onChange={(e)=>handleotpChange(e)} type="number" required="true" className=" w-full rounded-lg border-gray-200 p-4  text-sm shadow-sm" placeholder="Enter OTP" />
//    <button onClick={verifyotp}  type="submit" className="my-4 block w-full rounded-lg bg-pink-600 px-5 py-3 text-sm font-medium text-white">
//             Continue
//         </button>
//         </div> */}
