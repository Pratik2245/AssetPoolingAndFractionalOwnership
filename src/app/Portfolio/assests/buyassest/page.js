"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Web3 from "web3";
import APFOS from "../buyassest/APFOS_Contract.json"
import Ethconverter from "@/app/EThconvert";

const Page = () => {
    const [myContract, setMyContract] = useState(null);
    const [transactionHash, setTransactionHash] = useState(null);
    const [web3, setweb3] = useState(null);
    const [UserPrice, setUserPrice] = useState(0);
    const [sender, setsender] = useState(null);
    const router = useRouter();
    let price = Cookies.get("price");
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        if (!price) {
            router.push("/")
        }
        setContract();
        fetchEthereumPrice();
        Ethconverter();
    }, [])
    const handleAccountsChanged = async (accounts) => {
        setsender(accounts[0]); // Use the first account in the array
    };
    const fetchEthereumPrice = async () => {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
            const data = await response.json();
            return (data.ethereum.inr);
            // setEthPriceInINR(data.ethereum.inr);
        } catch (error) {
            console.error('Error fetching Ethereum price:', error);
        }
    }

    const setContract = async () => {
        try {

            // Force MetaMask to Sepolia
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xaa36a7" }],
            });

            let web3c = new Web3(window.ethereum);

            const chainId = await web3c.eth.getChainId();
            console.log("Chain ID:", chainId);

            setweb3(web3c);

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            setsender(accounts[0]);

            const balance = await web3c.eth.getBalance(accounts[0]);
            console.log("Wallet Balance:", web3c.utils.fromWei(balance, "ether"), "ETH");

            const contractAddress = "0xB35753cE63e2125850519AC6fAE0548C4874D465";

            const myContractInstance = new web3c.eth.Contract(APFOS, contractAddress);

            setMyContract(myContractInstance);

        } catch (error) {
            console.log(error);
        }
    };
    const [data, setdata] = useState({
        useremail: "",
        BuyAmount: "",
        pid: "",
        PortfolioTotalPrice: "",
        Transactionid: null,
        Transactionamount: null,
        OrginalBuyPrice: ""

    });
    const onchange = (e) => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let portfolioid = urlParams.get('pid'); // value1

        let APFOS_useremail = localStorage.getItem("APFOS_useremail");
        let val = e.target.value;
        setdata({
            ...data,
            useremail: APFOS_useremail,
            BuyAmount: val,
            pid: portfolioid,
            PortfolioTotalPrice: price,
            OrginalBuyPrice: val
        });
    };
    const BuyAssest = async (e) => {
        e.preventDefault();
        if (!sender) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setsender(accounts[0]);
        }
        console.log("Sender address:", sender);
        console.log("Balance:", await web3.eth.getBalance(sender));
        try {

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            let portfolioid = urlParams.get('pid'); // value1

            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/portfolio/portfoliodetails`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pid: portfolioid,
                }),
            });
            const response = await res.json();
            // e.preventDefault();
            // alert(response.error.RemainingPrice);
            if (response.error == null) {
                return alert("Invalid Asset Purchase");
            }

            // alert(data.BuyAmount < parseFloat(response.error.RemainingPrice))
            if (data.BuyAmount >= 1 && data.BuyAmount <= parseFloat(response.error.RemainingPrice)) {
                try {
                    const queryString = window.location.search;
                    const urlParams = new URLSearchParams(queryString);
                    let pid = urlParams.get('pid'); // value1

                    console.log(web3);

                    let p;
                    try {
                        p = await fetchEthereumPrice();
                        // alert(p);
                    }
                    catch (error) {
                        return alert("check internet connection,try again");
                    }
                    const amountInEther = (parseFloat(data.BuyAmount) / parseFloat(p)).toFixed(18);
                    const valueWei = web3.utils.toWei(amountInEther.toString(), "ether");
                    const gasPrice = await web3.eth.getGasPrice();

                    // Preliminary gas limit to use for initial balance check (fall back)
                    const provisionalGasLimit = 100000;

                    // Check sender balance before calling estimateGas (estimateGas may itself fail if balance is zero)
                    let required = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(provisionalGasLimit.toString())).add(web3.utils.toBN(valueWei));
                    let balance = web3.utils.toBN(await web3.eth.getBalance(sender));

                    if (balance.lt(required)) {
                        const needEth = web3.utils.fromWei(required, 'ether');
                        const haveEth = web3.utils.fromWei(balance, 'ether');
                        return alert(`Insufficient funds: need ${needEth} ETH but have ${haveEth} ETH. Please fund your account or lower the amount.`);
                    }

                    // Try to get a more accurate gas estimation, but fall back if it fails
                    let gasEstimation;
                    let gasLimit;
                    try {
                        gasEstimation = await myContract.methods.deposit(pid).estimateGas({
                            from: sender,
                            value: valueWei,
                        });
                        console.log('Gas Estimation:', gasEstimation);
                        gasLimit = Math.max(gasEstimation, provisionalGasLimit);
                    } catch (err) {
                        console.warn('estimateGas failed, using provisional gas limit', err);
                        gasLimit = provisionalGasLimit;
                    }

                    // Recompute required with final gasLimit and double-check balance
                    required = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(gasLimit.toString())).add(web3.utils.toBN(valueWei));
                    balance = web3.utils.toBN(await web3.eth.getBalance(sender));
                    if (balance.lt(required)) {
                        const needEth = web3.utils.fromWei(required, 'ether');
                        const haveEth = web3.utils.fromWei(balance, 'ether');
                        return alert(`Insufficient funds after gas estimate: need ${needEth} ETH but have ${haveEth} ETH.`);
                    }

                    const result = await myContract.methods.deposit(pid).send({
                        from: sender,
                        value: valueWei,
                        gas: gasLimit,
                        gasPrice: gasPrice,
                    });

                    console.log(result);

                    setTransactionHash(result.transactionHash);


                    await handleSubmit(e, result, amountInEther);
                }
                catch (error) {
                    console.log(error)
                    return alert("Invalid Attempt\n reason:-\n 1.Check Metamask Is Installed \n 2.Check Metamask Address \n 3.Transaction is Cancelled");
                }
            } else {
                toast.error(`Enter Amount Between [${1}-${response.error.RemainingPrice}]`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                return;
            }
        }
        catch (error) {
            alert(error.message);
        }
    }

    const handleSubmit = async (e, result, amountInEther) => {
        e.preventDefault();
        console.log(data);

        let url = window.location.href;
        let domain = new URL(url).hostname;
        let protocol = new URL(url).protocol;
        let port = new URL(url).port ? `:${new URL(url).port}` : '';
        let urlString = `${protocol}//${domain}${port}`;

        const res = await fetch(`${urlString}/api/portfolio/Assest/BuyAssest`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                useremail: data.useremail,
                BuyAmount: data.BuyAmount,
                pid: data.pid,
                PortfolioTotalPrice: data.PortfolioTotalPrice,
                OrginalBuyPrice: data.OrginalBuyPrice,
                Transactionid: result.transactionHash,
                Transactionamount: amountInEther,
            }),
        });
        const response = await res.json();
        console.log(response)
        if (response.status === 200) {
            toast.success("Asset Buy Successfully", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            Cookies.remove("price");
            router.push("/Portfolio/assests/buyassestlist");
        } else if (response.error == "Account Not Found") {
            toast.error("Account Not Found", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            router.push("/login");

        }
        else if (response.error == "Portfolio Not Found") {
            toast.error("Portfolio Not Found", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            router.push("/");

        }
        else if (response.status === 201) {
            toast.error("Invalid Format", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            router.push("/");
        }
        else {
            toast.error("Empty Field", {
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
        setdata({
            useremail: "",
            walletaddress: "",
        });


    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="mb-6 md:mb-0 flex flex-row justify-center my-2">
                <p className="text-2xl text-center text-white font-bold ml-3 bg-red-500 w-auto h-auto py-1 -2">
                    <span className=" bg-black text-white px-2 py-1">Bluechip</span> Art{" "}
                </p>
            </div>
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                        Transaction Page
                    </h1>

                    <form className="space-y-4 md:space-y-6" method="POST">
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                                Enter Amount
                            </label>
                            <input
                                onChange={(e) => onchange(e)}
                                type="number"
                                name="BuyAmount"
                                id="BuyAmount"
                                className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="min:10rs"
                                required="true"
                            />
                        </div>

                        <button
                            onClick={(e) => BuyAssest(e)}
                            type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                        >
                            Add
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;
