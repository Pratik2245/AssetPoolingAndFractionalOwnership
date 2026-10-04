'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";



const Page = () => {
  const router = useRouter();
  const [active, setactive] = useState('user')
  const [data, setdata] = useState({
    email: "",
    password: ""
  })

  useEffect(() => {
    if (localStorage.getItem('token')) {
      let token = localStorage.getItem('token').toString();
      const decoded = jwtDecode(token);
      console.log(decoded)
      // Check for expired token
      var dateNow = new Date() / 1000;
      if (dateNow > decoded.exp) {
        alert("Your session has been expired.")
        localStorage.removeItem('token');
        router.push('/login')
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
        if (decoded.role == "user") { router.push('/') }
        if (decoded.role == "admin") {
          router.push('/dashboard/portfolios')
        }
      }

    }
  })


  const onchange = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let val = e.target.value;
    setdata({ ...data, [name]: val });
    console.log(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.email == "" ||
      data.password == "") {
      toast.error("Please Enter All Fields", {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.status === 200) {
        localStorage.setItem('token', response.token)
        toast.success("Login Successful", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        localStorage.setItem("APFOS_useremail", data.email);
        console.log(response);
        if (response.metamaskaddress == "") {
          router.push("/addwalletdetails");
        }
        else {
          router.push("/")
        }
      } else if (response.status === 201) {
        toast.error("Invalid Credentials,Try Again..", {
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
      else if (response.status === 400) {
        toast.error("User not found.Please Register", {
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
      else {
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
      // setdata({ email: "", password: "" })
    }
  };


  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="mb-6 md:mb-0 flex flex-row justify-center my-2">
        <p className='text-2xl text-center text-white font-bold ml-3 bg-red-500 w-auto h-auto py-1 pr-2'><span className=' bg-black text-white px-2 py-1'>Bluechip</span> Art </p>
      </div>
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            Login to Your account
          </h1>
          <form className="space-y-4 md:space-y-6" method="POST">
            <div>
              <label for="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
              <input value={data.email} onChange={(e) => onchange(e)} type="email" name="email" id="email" className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" required="" />
            </div>
            <div>
              <label for="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
              <input value={data.password} onChange={(e) => onchange(e)} type="password" name="password" id="password" placeholder="••••••••" className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="" />
            </div>
            <div className="flex items-center justify-between">
              <Link href={'/forgetpassword'} className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</Link>
            </div>
            <button onClick={handleSubmit} type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Login</button>
            <p className="text-sm font-light text-gray-500 ">
              Don&apos;t have an account yet? <Link href={"/signup"} className="font-medium text-primary-600 hover:underline">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>

  )
}

export default Page

