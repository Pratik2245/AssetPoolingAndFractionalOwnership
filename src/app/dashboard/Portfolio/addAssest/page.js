'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Page = () => {
  const router = useRouter();
  // const  id = router.query;

  const [portfoliodata, setportfoliodata] = useState([]);
  const [data, setdata] = useState({
    AType: "",
    Assest_Title: "",
    Assest_Price: "",
    Assest_Quantity: "",
    Assest_Description: "",
  })
  const onchange = (e) => {
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // let pid = urlParams.get('pid'); // value1

    let name = e.target.name;
    let val = e.target.value;
    setdata({ ...data, [name]: val });

    // console.log(data);
  };
  const addAssest = (e) => {
    e.preventDefault();
    let data1 = localStorage.getItem("assestlist")
    let data2 = (JSON.parse(data1));
    console.log(data2);
    if (data2) {
      data2.push(data);
      localStorage.setItem("assestlist", JSON.stringify(data2));

    }
    else {

      setportfoliodata([data]);
      localStorage.setItem("assestlist", JSON.stringify([data]));
    }
    router.push("/Portfolio/addassest/assestlist");

  }
  useEffect(() => {
    if (localStorage.getItem("assestlist")) {
      setportfoliodata((localStorage.getItem("assestlist")));
    }
  }, [])

  return (
    <div style={{
      display: "flex", width: "100%", height: "100%", justifyContent: "space-around", color: "white"
    }}>
      < div style={{ width: "60%" }} className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-wrap lg:py-0" >
        <div className="mb-6 md:mb-0 flex flex-row justify-center my-2">
        </div>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Add Asset
            </h1>
            <form className="space-y-4 md:space-y-6" method="POST">
              <div>
                <label htmlFor="Assest_Title" className="block mb-2 text-sm font-medium text-gray-900 ">Asset Name</label>
                <input onChange={(e) => onchange(e)} type="text" name="Assest_Title" id="Assest_Title" className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Enter Assest Name" required="" />
              </div>
              <label htmlFor="AType" className="block mb-2 text-sm font-medium text-gray-900 ">Asset Type</label>
              <select onChange={(e) => onchange(e)} type="text" name="AType" id="AType" className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
                <option value="Stock" selected>Stock</option>
                <option value="Cryptocurrency">Cryptocurrency</option>
                <option value="Painting Assest">Painting Asset</option>
              </select>
              <div>
                <label htmlFor="Assest_Quantity" className="block mb-2 text-sm font-medium text-gray-900 ">Asset Quantity</label>
                <input onChange={(e) => onchange(e)} type="number" name="Assest_Quantity" id="Assest_Quatity" className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Enter Assest Quantity" required="" />
              </div>
              <div>
                <label htmlFor="Assest_Description" className="block mb-2 text-sm font-medium text-gray-900 ">Asset Description</label>
                <input onChange={(e) => onchange(e)} type="text" name="Assest_Description" id="Assest_Description" className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Enter Assest Description" required="" />
              </div>
              <div>
                <label htmlFor="Assest_Price" className="block mb-2 text-sm font-medium text-gray-900 ">Asset Price</label>
                <input onChange={(e) => onchange(e)} type="number" name="Assest_Price" id="Assest_Price" className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Enter Assest Price" required="" />
              </div>

              <Link href="/Portfolio/addassest/assestlist" onClick={addAssest} type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Add</Link>

            </form>
          </div>
        </div>
      </div>
      <div style={{ width: "40%", height: "100vh", textAlign: "center" }}>
        Added Asset List
        {
          portfoliodata && portfoliodata.map((data) => {
            <div className="assestlist" style={{
              display: "flex", width: "100%", height: "10vh", alignItems: "center",
              justifyContent: "space-around"
            }}>

              <p>{data.Assest_Title}</p><button style={{ background: "red" }}>delete</button>
            </div>
          })
        }
      </div>
    </div >

  )
}

export default Page
