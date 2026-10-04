"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from 'next/link'
import { jwtDecode } from "jwt-decode";
import Ethconverter from "@/app/EThconvert";


export default function Main() {
  const router = useRouter();


  const [portfoliodata, setportfoliodata] = useState("");
  const fetchdata = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let pid = urlParams.get("pid"); // value1

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/portfolio`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: localStorage.getItem("APFOS_useremail") }),
    });
    const response = await res.json();
    console.log(response)
    setportfoliodata(response.error);
  }
  // useEffect(() => {
  //   fetchdata();
  // }, [])
  useEffect(() => {
    Ethconverter();
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
        fetchdata();

      }
    }
  }, []);
  return (
    <div className="w-full h-screen rounded p-2 md:px-16">
      <div className="flex justify-center items-center my-2 mb-4">
        <span className="text-white text-lg font-bold">Portfolio List</span>
      </div>
      <div className="w-[100%] overflow-auto">
        <div className="max-h-[70vh] w-[50rem] md:w-full md:p-3 bg-white rounded  p-4 md:px-2 overflow-y-scroll">
          <div className="sticky top-0 flex bg-blue-200 rounded items-center border-b border-gray-300 px-5 py-2">
            <div className="w-[75%] ">
              <p className="text-lg font-bold">Asset Name</p>
            </div>
            <div className="w-[18%] md:w-32 text-center mx-1">
              <p className="text-lg font-bold">Price</p>
            </div>
            <div className="w-[24%] text-center mx-1">
              <p className="mx-auto font-bold w-16 py-1 px-2">Add</p>
            </div>
            <div className="w-[12%] text-center mx-1">
              <button className="text-red-500 font-bold py-1 px-2  ">
                Remove
              </button>
            </div>
          </div>
          <div className="bg-white  rounded-lg my-2">
            {
              portfoliodata && portfoliodata.map((data) => {
                return (
                  <div className="flex rounded items-center border-b-2 border-gray-300 px-5 py-5" key={data.id}>
                    <Link href={`/Portfolio/PortfolioDetails?pid=${data._id}`} className="w-[75%]">
                      <p className="text-lg font-semibold">{data.PortfolioName}</p>
                    </Link>
                    <div className="w-[18%] md:w-32 text-center mx-1">
                      <p className="text-lg font-bold">{data.Price}</p>
                    </div>
                    <div className="w-[24%] text-center mx-1">
                      <p className="mx-auto font-bold w-16 py-1 px-2">
                        <Link href={`/Portfolio/AddAssest?pid=${data._id}`}>
                          Add Asset
                        </Link>

                      </p>
                    </div>
                    <div className="w-[12%] text-center mx-1">
                      <button className="text-red-500 font-bold py-1 px-2">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            }
            <div className="flex rounded items-center border-b-2 border-gray-300 px-5 py-5">
              <Link style={{ color: "green" }} href="/Portfolio/CreatePortfolio">Create New Portfolio</Link>
            </div>

          </div>


        </div>
      </div>
    </div>
    // </div >

  );
}
