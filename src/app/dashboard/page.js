'use client'
import React, { useState } from "react";
import Chart from "chart.js";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Ethconverter from "../EThconvert";




export default function Graph() {
  const [showlist, setshowlist] = useState(false)
  const router = useRouter();
  const [dollarPrice, setDollarPrice] = useState(0);
  const [priceData, setpriceData] = useState([]);
  const [selectState, setSelectState] = useState("day");
  const [dateData, setdateData] = useState([]);
  const [portfoliodata, setportfoliodata] = useState([]);
  const [totalAssest, settotalAssest] = useState(0);
  const [daydata, setdaydata] = useState([]);
  function changeData(e) {
    if (e.target.value == "day") {
      setSelectState("day")
    }
    else {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      let pid = urlParams.get("pid"); // value1
      router.push("/dashboard/weekgraph?pid=" + pid);
    }
  }
  React.useEffect(() => {

    async function fetchdata() {
      Ethconverter();
      async function dollarconverter() {
        let Dollarprice = (await fetch("https://api.exchangerate-api.com/v4/latest/USD"));
        let price = await Dollarprice.json()
        setDollarPrice(price.rates["INR"])
      }
      dollarconverter()
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      let pid = urlParams.get("pid"); // value1

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}api/portfolio/graphdata`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pid: pid }),
        }
      );
      const response = await res.json()
      setportfoliodata(response.portfoliodata);
      settotalAssest(response.portfoliodata.Assests.length)
      console.log(response.currentYear);
      let date = []
      let weekdata = [];
      let total = 0;
      let count = 0;
      if (response.currentYear && Array.isArray(response.currentYear)) {
        daydata.length = 0
        if (selectState == "week") {

          for (let i = 0; i < response.currentYear.length; i++) {
            let day = new Date(response.currentYear[i].date).getDay()
            if (day == 0) {
              let d = new Date(response.currentYear[i].date).getDate()
              let m = new Date(response.currentYear[i].date).getMonth() + 1;
              let dm = d + "/" + m
              date.push(dm);
              console.log(total)
              daydata.push(parseInt(total / count))
              total = 0;
              count = 0
            }
            else {
              count++;
              total += response.currentYear[i].price;
            }
          }
        }
        else {

          for (let i = 0; i < response.currentYear.length; i++) {
            daydata.push(response.currentYear[i].price);
            let d = new Date(response.currentYear[i].date).getDate()
            let m = new Date(response.currentYear[i].date).getMonth() + 1;
            let dm = d + "/" + m
            date.push(dm);
            setdateData(priceData.push(response.currentYear[i].date));
          }
        }
      }

      console.log(daydata);
      console.log(date);
      var config = {
        type: "line",
        data: {
          labels: date,
          datasets: [
            {
              label: new Date().getFullYear(),
              backgroundColor: "#3182ce",
              borderColor: "#3182ce",
              data: daydata,
              fill: false,
            },

          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: {
            display: false,
            text: "Sales Charts",
            fontColor: "white",
          },
          legend: {
            labels: {
              fontColor: "white",
            },
            align: "end",
            position: "bottom",

          },
          tooltips: {
            mode: "index",
            intersect: false,
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: "rgba(255,255,255,.7)",
                },
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Month",
                  fontColor: "white",
                },
                gridLines: {
                  display: false,
                  borderDash: [2],
                  borderDashOffset: [2],
                  color: "rgba(33, 37, 41, 0.3)",
                  zeroLineColor: "rgba(0, 0, 0, 0)",
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: "rgba(255,255,255,.7)",
                },
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Value",
                  fontColor: "white",
                },
                gridLines: {
                  borderDash: [3],
                  borderDashOffset: [3],
                  drawBorder: false,
                  color: "rgba(255, 255, 255, 0.15)",
                  zeroLineColor: "rgba(33, 37, 41, 0)",
                  zeroLineBorderDash: [2],
                  zeroLineBorderDashOffset: [2],
                },
              },
            ],
          },
        },
      };
      var ctx = document.getElementById("line-chart").getContext("2d");
      window.myLine = new Chart(ctx, config);


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
            // fetchdata();
          }
          if (decoded.role == "user") {
            // router.push('/');
          }
        }
      }
    }
    fetchdata();
  }, [selectState]);
  return (
    <>
      <div className="flex flex-col break-words w-screen md:w-[70vw] mx-auto mb-4 border-1 shadow-lg rounded bg-transparent">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-white mb-1 text-xs font-semibold">
                Overview
              </h6>
              <h2 className="text-white text-xl font-semibold">Asset value</h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col items-center w-[100%]">
          <div className="w-full h-[60vh] ">
            <canvas id="line-chart" className=""></canvas>
          </div>
          <select onChange={changeData}>
            <option value="day">day</option>
            <option value="week">week</option>
          </select>
          <Link href={'/dashboard/portfolios'} className="w-fit text-purple-800 bg-white hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm mx-2 px-2 py-2.5 text-center ">View Portfolios</Link>
          <div className="flex flex-wrap align-items-center m-2">
            <span className="text-white font-semibold text-lg mx-1 px-2 py-2.5 text-center ">Total Assets :{portfoliodata && totalAssest} </span>
            <span className="text-white font-semibold text-lg mx-1 px-2 py-2.5 text-center ">Sold : ₹{portfoliodata && parseFloat(portfoliodata.Price) - parseFloat(portfoliodata.RemainingPrice)}|${portfoliodata && (parseFloat(portfoliodata.Price) - parseFloat(portfoliodata.RemainingPrice) / dollarPrice).toFixed(2)}</span>
            <span className="text-white font-semibold text-lg mx-1 px-2 py-2.5 text-center ">Available : ₹{portfoliodata && portfoliodata.RemainingPrice}|${portfoliodata && (portfoliodata.RemainingPrice / dollarPrice).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
