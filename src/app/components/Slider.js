'use client';
import react, { useEffect, useState } from 'react'
import Link from 'next/link'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const Slider = () => {
    const [popularMovies, setpopularMovies] = useState([])
    //     useEffect(() => {
    //         fetch("https://api.themoviedb.org/3/movie/popular?api_key=fca8a4b893c170d5868618d48948fdf2")
    //             .then(res => res.json())
    //             .then(data => setpopularMovies(data.results))


    // },[])
    return (
        <></>
        // <Carousel
        //     showThumbs={true}
        //     autoPlay={true}
        //     transitionTime={2}
        //     infiniteLoop={true}
        //     showStatus={false}
        //     className="w-100 h-100"
        // >
        //     {

        //         popularMovies.map((elem, index) => {
        //             return (
        //                 <Link key={index} href={`/products`}>
        //                     <div>
        //                         <img src={`https://image.tmdb.org/t/p/original${elem && elem.backdrop_path
        //                             }`} />
        //                         <p className="legend"> {elem ? elem.original_title : ""}</p>
        //                     </div>

        //                 </Link>
        //             )
        //         })
        //     }
        // </Carousel>
    )
}

export default Slider