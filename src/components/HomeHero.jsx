// ─────────────────────────────────────────────────────────────────────────────
// Author  : ThiruXD
// GitHub  : https://github.com/ThiruXD
// Portfolio: https://thiruxd.is-a.dev
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Autoplay, Navigation, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-creative";
import "react-lazy-load-image-component/src/effects/black-and-white.css";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { PiStarFill } from "react-icons/pi";

// Accent color for the curved shape + Watch Online button.
// Change this single value to re-theme every hero slide.
const ACCENT_COLOR = "#f97316";

const slugify = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

function StarRating({ value = 0, max = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <PiStarFill
          key={i}
          className={
            i < Math.round(value)
              ? "text-yellow-400"
              : "text-white/25"
          }
        />
      ))}
    </div>
  );
}

export default function HeroSlider({ movieData, isMovieDataLoading }) {
  return (
    <div className="">
      {!isMovieDataLoading ? (
        <>
          <Swiper
            modules={[Autoplay, Navigation, A11y]}
            grabCursor={true}
            lazy="true"
            loop={true}
            navigation={{
              prevEl: ".heroSlidePrev",
              nextEl: ".heroSlideNext",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={30}
            keyboard={{
              enabled: true,
            }}
          >
            {movieData.map((movie, index) => {
              const watchLink =
                movie.media_type === "tv" ||
                movie.media_type === "tvshow" ||
                movie.media_type === "series"
                  ? `/ser/${movie.tmdb_id}/${movie.slug || slugify(movie.title)}`
                  : `/mov/${movie.tmdb_id}/${movie.slug || slugify(movie.title)}`;
              const ratingOutOf5 = Math.round(
                (parseFloat(movie.rating) || 0) / 2
              );

              return (
                <SwiperSlide key={index}>
                  <section className="relative w-full overflow-hidden rounded-2xl bg-neutral-950 text-white aspect-video md:h-96 md:aspect-auto">
                    {/* Backdrop image */}
                    <div className="absolute inset-0">
                      {index === 0 ? (
                        <img
                          src={movie.backdrop}
                          className="h-full w-full object-cover object-center opacity-70"
                          alt={movie.title}
                          fetchPriority="high"
                          loading="eager"
                        />
                      ) : (
                        <LazyLoadImage
                          src={movie.backdrop}
                          className="h-full w-full object-cover object-center opacity-70"
                          effect="black-and-white"
                          alt={movie.title}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col justify-center gap-2 xs:gap-3 p-4 sm:p-8 md:p-10 max-w-xl">
                      {movie.genres && movie.genres[0] && (
                        <span className="text-[0.6rem] sm:text-xs uppercase tracking-[0.2em] text-white/60">
                          {movie.genres[0]}
                        </span>
                      )}

                      {movie.title && (
                        <h1 className="line-clamp-1 text-xl sm:text-3xl md:text-4xl font-bold leading-tight">
                          {movie.title}
                        </h1>
                      )}

                      <StarRating value={ratingOutOf5} />

                      {movie.description && (
                        <p className="hidden sm:block text-xs sm:text-sm md:text-base text-white/75 leading-relaxed line-clamp-2">
                          {movie.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-[0.6rem] lg:text-[0.7rem] xl:text-[0.9rem] text-white/60">
                        {movie.release_year && <span>{movie.release_year}</span>}
                        {movie.release_year && <span>•</span>}
                        <span>
                          {movie.languages
                            ?.map(
                              (lang) =>
                                lang.charAt(0).toUpperCase() + lang.slice(1)
                            )
                            .join("-")}
                        </span>
                        {movie.rip && <span>|</span>}
                        {movie.rip && <span>{movie.rip}</span>}
                      </div>

                      <Link
                        to={watchLink}
                        style={{ backgroundColor: ACCENT_COLOR, textDecoration: "none" }}
                        className="mt-1 relative inline-flex w-fit items-center rounded-full pl-5 pr-2 py-2 sm:pl-6 sm:pr-2.5 sm:py-2.5 text-sm sm:text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                      >
                        <span className="mr-8 sm:mr-10">Watch Online</span>
                        <span className="absolute right-1 sm:right-1.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white text-black">
                          <FaPlay className="ml-0.5 text-xs sm:text-sm" />
                        </span>
                      </Link>
                    </div>
                  </section>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="flex items-center gap-3 mt-5 pl-4 sm:pl-8">
            <BsArrowLeftCircle className="heroSlidePrev text-[2.4rem] text-secondaryTextColor p-2 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:bg-bgColorSecondary hover:text-primaryTextColor " />
            <BsArrowRightCircle className="heroSlideNext text-[2.4rem] text-secondaryTextColor p-2 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:bg-bgColorSecondary hover:text-primaryTextColor" />
          </div>
        </>
      ) : (
        <div className="relative animate-pulse">
          <div className="bg-bgColorSecondary rounded-2xl aspect-video md:h-96 md:aspect-auto w-full relative overflow-hidden">
            <div className="absolute bottom-4 left-4 right-0 sm:left-8 flex flex-col gap-2 w-[90%] md:w-2/3 lg:w-1/2">
              <div className="h-7 sm:h-9 bg-bgColor/50 rounded-full w-2/3"></div>
              <div className="hidden sm:flex gap-2 items-center mt-1">
                <div className="h-3 bg-bgColor/50 rounded-full w-12"></div>
                <div className="h-3 bg-bgColor/50 rounded-full w-20"></div>
              </div>
              <div className="h-4 bg-bgColor/50 rounded-full w-4/5 mt-1 sm:mt-2"></div>
              <div className="h-4 bg-bgColor/50 rounded-full w-1/2 mt-1"></div>
              <div className="h-8 bg-bgColor/50 rounded-full w-28 mt-3"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
