"use client";
import Link from "next/link";
import react, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Ethconverter from "../EThconvert";


const Page = () => {
  const [term, setterm] = useState("popular");
  const [portfoliodata, setportfoliodata] = useState([]);
  const [dollarPrice, setDollarPrice] = useState(0);

  const router = useRouter();

  useEffect(() => {
    Ethconverter()
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
        if (decoded.role == "user") {
          allportfoliodata();
        }
        if (decoded.role == "admin") {
          router.push('/dashboard/porfolios');
        }
      }
    } else {
      router.push('/login')
    }
  }, []);

  const allportfoliodata = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}api/portfolio/AllPortfolio`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: "",
      }
    );
    const response = await res.json();
    console.log("completed");
    setportfoliodata(response.error);
  };



  return (
    <div>
      <section className="text-gray-600 body-font min-h-screen">
        <div className="flex flex-col justify-center items-center w-auto p-4 md:p-10 overflow-hidden">
          <div className="flex flex-wrap w-full justify-center items-center">
            <div className="text-center w-full my-2">
              <span className="text-white font-bold text-xl">
                All Portfolios
              </span>
            </div>
            {portfoliodata &&
              portfoliodata.map((elem, index) => {
                if (index < 100) {
                  console.log(elem);
                  return (
                    <div key={index}>
                      {/* <div className="card" style={{ width: "18rem", color: "white", border: "1px solid red" }}>
									<div className="card-body">
										<h5 className="card-title"><Link key={index} href={`/Portfolio/portfoliodetails?pid=${elem._id}`}>{elem.PortfolioName}</Link>
										</h5>
										<Link onClick={() => { Cookies.set("price", `${elem.Price}`) }} style={{ width: "10vh", color: "black" }} key={index} href={`/Portfolio/Assests/BuyAssest?pid=${elem._id}`}><div className="bg-white shadow-md rounded-lg max-w-sm m-2">
											buy
										</div>
										</Link>
									</div>
								</div> */}

                      <div className="bg-white shadow-md rounded-lg max-w-sm m-2">
                        <Link
                          key={index}
                          href={`/Portfolio/portfoliodetails?pid=${elem._id}`}
                        >
                          <h2 className="m-2 p-3 font-bold text-blue-600 text-3xl">
                            {elem.PortfolioName}
                          </h2>
                        </Link>
                        <div className="m-2 px-4 pb-4">
                          <p>
                            <span className="text-black font-medium text-lg tracking-tight ">
                              {/* {(elem ? elem.overview : "").slice(0, 100) + "..."} */}
                              
                            </span>
                          </p>

                          <div className="flex flex-wrap items-center justify-center my-2 mt-4">
                            <span className="text-sm font-bold m-2 px-2 py-2 rounded bg-orange-700 text-white">
                              Previous:₹{elem.PortfolioPrice && elem.PortfolioPrice[0].Price}
                              |${elem.PortfolioPrice && (elem.PortfolioPrice[0].Price / dollarPrice).toFixed(2)}
                            </span>
                            <span className="text-sm font-bold m-2 px-2 py-2 rounded bg-green-700 text-white">
                              Current:₹{elem.PortfolioPrice && elem.PortfolioPrice[0].Price}
                              |${elem.PortfolioPrice && (elem.PortfolioPrice[0].Price / dollarPrice).toFixed(2)}
                            </span>
                            <span className="text-sm font-bold m-2 px-2 py-2 rounded bg-pink-700 text-white">
                              Remaining:₹{Math.round(elem.RemainingPrice)}
                              |${((elem.RemainingPrice) / dollarPrice).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-center my-2 mt-4">
                            <Link
                              onClick={() => {
                                Cookies.set("price", `${elem.Price}`);
                              }}
                              href={`Portfolio/assests/buyassest?pid=${elem._id}`}
                            >
                              <p className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                                Buy
                              </p>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
