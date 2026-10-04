"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import defaultpic from "../images/defaultprofile.jpg"

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token").toString();
      const decoded = jwtDecode(token);
      console.log(decoded);
      // Check for expired token
      var dateNow = new Date() / 1000;
      if (dateNow > decoded.exp) {
        alert("Your session has been expired.");
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        toast.error("Your are LoggedIn", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        if (decoded.role == "admin") {
          router.push('/dashboard/portfolios');
        }
        if (decoded.role == "user") {
          router.push('/');
        }
      }
    } else {
      router.push('/orgsignup');
    }
  }, []);

  const [data, setdata] = useState({
    email: "",
    organization: "",
    address: "",
    phone: "",
    password: "",
    cpassword: "",
    pic: defaultpic.src
  });

  const onchange = (e) => {
    let name = e.target.name;
    let val = e.target.value;
    setdata({ ...data, [name]: val });
    console.log(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      data.email &&
      data.organization &&
      data.address &&
      data.password &&
      data.cpassword
    ) {
      if (data.password.length >= 8) {
        if (data.password === data.cpassword) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/orgsignup`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const response = await res.json();
          if (response.status === 200) {
            toast.success("Registration Successful", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            localStorage.setItem("APFOS_useremail", data.email);
            setTimeout(() => {
              router.push("/addwalletdetails");
            }, 1000);
          } else {
            toast.error(response.message, {
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
        } else {
          toast.error("Confirm Password Not Match", {
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
      } else {
        toast.error("Password must be 8 Atleast characters", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      toast.error("Enter All Fields", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  return (
    <div className="flex flex-col items-center justify-center px-6 py-6 mx-auto">
      <div className="mb-6 md:mb-0 flex flex-row justify-content-center justify-center my-2">
        <p className="text-2xl text-center text-white font-bold ml-3 bg-red-500 w-auto h-auto py-1 pr-2">
          <span className=" bg-black text-white px-2 py-1">Bluechip</span> Art{" "}
        </p>
      </div>
      <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            Create Organization account
          </h1>
          <div className="flex  w-[100%]">
            <Link
              href={"/signup"}
              className="w-[50%] text-gray-600 bg-gray-200 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm m-2 px-3 py-2.5 text-center "
            >
              User
            </Link>
            <Link
              href={"/orgsignup"}
              className="w-[50%] text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm m-2 px-3 py-2.5 text-center "
            >
              Organization
            </Link>
          </div>
          <form className="space-y-4 md:space-y-6" action="#" method="POST">
            <div>
              <label
                for="email"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Your email
              </label>
              <input
                onChange={(e) => onchange(e)}
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder="name@company.com"
                required="true"
              />
            </div>
            <div>
              <label
                for="organization"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Organization Name
              </label>
              <input
                onChange={(e) => onchange(e)}
                type="text"
                name="organization"
                id="org"
                className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Your Organization"
                required="true"
              />
            </div>
            <div>
              <label
                for="organization"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Phone Number
              </label>
              <input
                onChange={(e) => onchange(e)}
                type="number"
                name="phone"
                id="phone"
                className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Your Organization"
                required="true"
              />
            </div>
            <div>
              <label
                for="address"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Address
              </label>
              <input
                onChange={(e) => onchange(e)}
                type="text"
                name="address"
                id="address"
                className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Your Address"
                required="true"
              />
            </div>
            <div>
              <label
                for="password"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Password
              </label>
              <input
                onChange={(e) => onchange(e)}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                required="true"
              />
            </div>
            <div>
              <label
                for="cpassword"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Confirm password
              </label>
              <input
                onChange={(e) => onchange(e)}
                type="password"
                name="cpassword"
                id="cpassword"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                required="true"
              />
            </div>

            <button
              onClick={(e) => handleSubmit(e)}
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              Create an account
            </button>
            <p className="text-sm font-light text-gray-500 ">
              Already have an account?{" "}
              <Link
                href={"/login"}
                className="font-medium text-primary-600 hover:underline "
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
