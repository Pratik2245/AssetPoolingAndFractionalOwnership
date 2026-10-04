"use client";
import react, { useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {

    const [contactdata, setcontactdata] = useState({
        email: "",
        subject: "",
        message: "",
    })


    const onChange = (e) => {
        e.preventDefault();
        let name = e.target.name;
        let val = e.target.value;
        setcontactdata({ ...contactdata, [name]: val });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (contactdata.email && contactdata.subject && contactdata.message) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/sendContactEmail`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(contactdata),
            });
            const response = await res.json();
            console.log(response);
            if (response.status === 200) {
                toast.success("Message sent succesfully", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                setcontactdata({
                    email: "",
                    subject: "",
                    message: "",
                });
            } else {
                toast.error("Error. Try Again", {
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
        } else {
            toast.error("Fill All the Fields", {
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
    }
    return (
        <div>
            <div className="p-5 md:p-12 mx-auto w-full md:w-[50%] m-5 bg-white  rounded-lg">
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 ">Contact Us</h2>
                <p className="mb-8 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.</p>
                <form action="#" className="space-y-8">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                        <input onChange={(e) => onChange(e)} value={contactdata.email} name="email" type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 " placeholder="name@flowbite.com" required />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 ">Subject</label>
                        <input onChange={(e) => onChange(e)} value={contactdata.subject} name="subject" type="text" id="subject" className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500  " placeholder="Let us know how we can help you" required />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 ">Your message</label>
                        <textarea onChange={(e) => onChange(e)} value={contactdata.message} name='message' id="message" rows="6" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 " placeholder="Leave a comment..."></textarea>
                    </div>
                    <button onClick={(e) => handleSubmit(e)} type="submit" className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-700 sm:w-fit hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300">Send message</button>
                </form>
            </div></div>
    )
}

export default Page;