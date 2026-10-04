"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import Ethconverter from "@/app/EThconvert";


export default function Main() {
  const router = useRouter();
  var amt = 0,
    qty = 0,
    ass = 0;
  const [dollarPrice, setDollarPrice] = useState(0);

  const [prices, setprices] = useState({ prev: "", curr: "", rem: "" })
  const [data, setdata] = useState({
    AType: "",
    Assest_Title: "",
    Assest_Price: "",
    Assest_Quantity: "",
    Assest_Description: "",
  })

  useEffect(() => {
    async function dollarconverter() {
      let Dollarprice = (await fetch("https://api.exchangerate-api.com/v4/latest/USD"));
      let price = await Dollarprice.json()
      setDollarPrice(price.rates["INR"])
    }
    dollarconverter()
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
        if (decoded.role == "admin") {
          fetchdata();
        }
        if (decoded.role == "user") {
          router.push('/');
        }
      }
    }
  }, []);


  const [portfoliodata, setportfoliodata] = useState("");

  const fetchdata = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let pid = urlParams.get("pid"); // value1

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}api/portfolio/portfoliodetails`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pid: pid }),
      }
    );
    const response = await res.json();
    console.log("response.error");
    setportfoliodata(response.error);
    setprices(
      { prev: response.error.PortfolioPrice[response.error.PortfolioPrice.length - 2] && response.error.PortfolioPrice[response.error.PortfolioPrice.length - 2].Price, curr: response.error.PortfolioPrice[response.error.PortfolioPrice.length - 1] && response.error.PortfolioPrice[response.error.PortfolioPrice.length - 1].Price, rem: response.error.RemainingPrice });

  };

  return (
    <div onLoad={Ethconverter} className=" w-[100%] h-fit rounded p-2 pb-4 md:px-16">

      <div className="flex justify-center items-center my-2 mb-4">
        <span className="text-white text-lg font-bold">
          Portfolio of {portfoliodata.PortfolioName}
        </span>
      </div>
      <div className=" shadow-md rounded md:overflow-hidden overflow-scroll">
        <div className="flex flex-wrap items-center justify-center my-2 mt-4">
          <span className="text-md font-bold m-2 px-2 py-2 rounded bg-orange-700 text-white">
            Previous:₹
            {
              prices.prev ?
                prices.prev : "Not Available"
            }
            |${
              prices.prev ?
                (prices.prev / dollarPrice).toFixed(2) : "Not Available"
            }
          </span>
          <span className="text-md font-bold m-2 px-2 py-2 rounded bg-green-700 text-white">
            Current:₹
            {
              prices.curr ?
                prices.curr : "Not Available"
            }
            |${
              prices.curr ?
                (prices.curr / dollarPrice).toFixed(2) : "Not Available"
            }
          </span>

        </div>
        <div className="flex flex-col items-center justify-center my-2 ">
          <Link
            href={'/dashboard/Portfolio/createportfolio'}
            className="text-md font-bold m-2 px-3 py-2 rounded bg-blue-700 text-white"
          >
            Create New Portfolio
          </Link>

        </div>

        <div className="relative rounded-lg overflow-x-auto overflow-y-hidden">
          <table className="w-full  px-4 text-md text-left  text-black ">
            <thead className="text-md  text-white uppercase bg-blue-400 ">
              <tr className="">
                <th scope="col" className="px-6 py-3">
                  Asset Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Asset Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>

              </tr>
            </thead>
            <tbody>
              {portfoliodata.Assests &&
                portfoliodata.Assests.map((data, index) => {
                  amt = amt + parseInt(data.Assest_Price * data.Assest_Quantity);
                  qty = qty + parseInt(data.Assest_Quantity);
                  ass = index + 1;
                  return (
                    <tr key={index} className="bg-white border-b ">
                      <td
                        scope="row"
                        className="px-6 py-4  text-gray-900 whitespace-nowrap "
                      >
                        <p className="text-lg font-semibold">
                          {data.Assest_Title}
                        </p>
                        <p className="text-gray-500">
                          {data.Assest_Description}
                        </p>
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4  text-gray-900 whitespace-nowrap "
                      >
                        {data.AType}
                      </td>

                      <td className="px-6 py-4">₹{data.Assest_Price}|${(data.Assest_Price / dollarPrice).toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <p className="w-16 border rounded-md py-1 px-2 focus:outline-none">
                          {data.Assest_Quantity}
                        </p>
                      </td>
                    </tr>
                  );
                })}

              <tr className="bg-white border-b ">
                <td className="px-6 py-4">
                  <p className="text-lg font-semibold">Assets:{ass}</p>
                </td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4">
                  <p className="text-lg font-semibold">Price:₹{amt}|${(amt / dollarPrice).toFixed(2)}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold py-1 px-2 ">Quantity:{qty}</p>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* <div className="w-[100%] overflow-auto">
        <div className="max-h-[70vh] w-[50rem] md:w-full md:p-3 bg-white rounded  p-4 md:px-2 overflow-y-scroll">
          <div className="sticky top-0 flex bg-blue-200 rounded items-center border-b border-gray-300 px-5 py-2">
            <div className="w-[75%] ">
              <p className="text-lg font-bold">Asset Name</p>
            </div>
            <div className="w-[18%] md:w-32 text-center mx-1">
              <p className="text-lg font-bold">Price</p>
            </div>
            <div className="w-[24%] text-center mx-1">
              <p className="mx-auto font-bold w-16 py-1 px-2">Assest Type</p>
            </div>
            <div className="w-[24%] text-center mx-1">
              <p className="mx-auto font-bold w-16 py-1 px-2">Assest Quantity</p>
            </div>
            <div className="w-[24%] text-center mx-1">
              <p className="mx-auto font-bold w-16 py-1 px-2">Assest Description</p>
            </div>

            <div className="w-[24%] text-center mx-1">
              <p className="mx-auto font-bold w-16 py-1 px-2">Option</p>
            </div>
          </div>
          <div className="bg-white  rounded my-2">
            {
              portfoliodata.Assests && portfoliodata.Assests.map((data) => {
                return (
                  <div className="flex rounded items-center border-b-2 border-gray-300 px-5 py-5" key={data.id}>
                    <div className="w-[75%]">
                      <p className="text-lg font-semibold">{data.Assest_Title}</p>
                    </div>
                    <div className="w-[18%] md:w-32 text-center mx-1">
                      <p className="text-lg font-bold">{data.Assest_Price}</p>
                    </div>
                    <div className="w-[18%] md:w-32 text-center mx-1">
                      <p className="text-lg font-bold">{data.AType}</p>
                    </div>

                    <div className="w-[18%] md:w-32 text-center mx-1">
                      <p className="text-lg font-bold">{data.Assest_Quantity}</p>
                    </div>
                    <div className="w-[18%] md:w-32 text-center mx-1">
                      <p className="text-lg font-bold">{data.Assest_Description}</p>
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
            }
              
            
            <div className="flex rounded items-center border-b-2 border-gray-300 px-5 py-5">
              Total:-  {portfoliodata && portfoliodata.Price}
            </div>

          </div>


        </div>
    // </div >
      </div> */}
    </div>
  );
}
