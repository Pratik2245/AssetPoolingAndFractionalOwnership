'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as jwt_decode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
var jwt = require('jsonwebtoken');


const Myaccount = () => {
  const router = useRouter();
  const [user, setuser] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    pincode: "",
    password: "",
    cpassword: "",
    exp: "",
  })
  useEffect(() => {
    if (localStorage.getItem('token')) {
      let decoded = jwt_decode(localStorage.getItem('token'));
      setuser({ name: decoded.name, email: decoded.email, phone: decoded.phone, address: decoded.address, pincode: decoded.pincode, exp: decoded.exp })
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        localStorage.removeItem('token')
        console.log('expired')
        router.push("/login")
      }
    }
    else {
      router.push("/")
    }
  }, []);

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setuser({ ...user, [name]: value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    let decoded = jwt_decode(localStorage.getItem('token'));
    setuser({ name: decoded.name, email: decoded.email, phone: decoded.phone, address: decoded.address, pincode: decoded.pincode, exp: decoded.exp })
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      localStorage.removeItem('token')
      router.push("/login")
      console.log('expired')
    }
    else {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/updateUser`, {
        method: "POST",
        headers: {
          Accept: "Application/json",
          "Content-Type": "Application/json"
        },
        body: JSON.stringify(user)
      })

      const response = await res.json();
      if (response.status === 200) {
        localStorage.removeItem('token')
        localStorage.setItem('token', response.token)
        toast.success("Details saved Successful", {
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
        toast.error("Comfirm password does not match", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (response.status === 202) {
        toast.error("Please fill all the details", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Failed to Save.Try again..", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8 min-h-screen">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"></div>
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Contact sales
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Aute magna irure deserunt veniam aliqua magna enim voluptate.
          </p>
        </div>
        <form method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="py-4">
            <h3 className="text-3xl font-bold text-gray-900 sm:text-xl">
              Personal Info:
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2.5">
                <input
                  onChange={handleChange}
                  value={user.name}
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="off"
                  required="true"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Email (cannot be changed)
              </label>
              <div className="mt-2.5">
                <input
                  onChange={handleChange}
                  value={user.email}
                  type="email"
                  name="email"
                  id="email"
                  required="true"
                  disabled={true}
                  autoComplete="off"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="company"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Address
              </label>
              <div className="mt-2.5">
                <input
                  onChange={handleChange}
                  value={user.address}
                  type="text"
                  name="address"
                  id="address"
                  autoComplete="off"
                  required="true"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Phone No.
              </label>
              <div className="mt-2.5">
                <input
                  onChange={handleChange}
                  value={user.phone}
                  type="number"
                  name="phone"
                  id="phone"
                  autoComplete="off"
                  required="true"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Pincode
              </label>
              <div className="mt-2.5">
                <input
                  onChange={handleChange}
                  value={user.pincode}
                  type="number"
                  name="pincode"
                  id="pincode"
                  autoComplete="off"
                  required="true"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="py-4">
            <h3 className="text-3xl font-bold text-gray-900 sm:text-xl">
              Change Password
            </h3>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Pasword
            </label>
            <div className="mt-2.5">
              <input
                onChange={handleChange}
                value={user.password || ""}
                type="password"
                name="password"
                id="password"
                autoComplete="off"
                required="true"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="cpassword"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Confirm Password
            </label>
            <div className="mt-2.5">
              <input
                onChange={handleChange}
                value={user.cpassword || ""}
                type="password"
                name="cpassword"
                id="cpassword"
                required="true"
                autoComplete="off"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mt-10">
            <button
              onClick={handleSubmit}
              type="submit"
              className="block w-full rounded-md bg-pink-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Myaccount;
