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

const slugify = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function HeroSlider({ movieData, isMovieDataLoading }) {
  return (
    <div className="">
      {!isMovieDataLoading ? (
        <>
          <Swiper
            modules={[Autoplay, Navigation, A11y]}
            grabCursor={true}
            lazy={true}
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
          >
            {movieData.map((movie, index) => {
              const isSeries = ["tv", "tvshow", "series"].includes(movie.media_type);
              const moviePath = isSeries
                ? `/ser/${movie.tmdb_id}/${movie.slug || slugify(movie.title)}`
                : `/mov/${movie.tmdb_id}/${movie.slug || slugify(movie.title)}`;

              return (
                <SwiperSlide key={movie.tmdb_id || index}>
                  <div className="relative">
                    <div className="rounded-t-2xl aspect-video md:h-96 mask md:aspect-auto">
                      {index === 0 ? (
                        <img
                          src={movie.backdrop}
                          className="rounded-t-2xl w-full h-full object-cover"
                          alt={movie.title}
                          fetchPriority="high"
                          loading="eager"
                        />
                      ) : (
                        <LazyLoadImage
                          src={movie.backdrop}
                          className="rounded-t-2xl w-full h-full object-cover"
                          effect="black-and-white"
                          alt={movie.title}
                        />
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-0 sm:left-8 flex flex-col gap-1 xs:gap-2 text-secondaryTextColor w-[90%] md:w-2/3 lg:w-1/2 before:content-[''] before:absolute before:-inset-4 before:-left-4 before:sm:-left-8 before:-bottom-4 before:bg-white/40 dark:before:bg-transparent before:backdrop-blur-md dark:before:backdrop-blur-none before:z-[-1] before:mask">
                      {/* Title */}
                      {movie.title && (
                        <h1 className="line-clamp-1 w-[90%] text-xl sm:text-3xl md:text-4xl font-extrabold text-primaryTextColor">
                          {movie.title}
                        </h1>
                      )}

                      {/* Year • Type • Rip • Rating */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {movie.release_year && (
                          <p className="text-[0.6rem] lg:text-[0.7rem] xl:text-[0.9rem]">
                            📅 {movie.release_year}
                          </p>
                        )}
                        <span className="text-white/40">•</span>
                        <p className="text-[0.6rem] lg:text-[0.7rem] xl:text-[0.9rem]">
                          {isSeries ? "📺 Series" : "🎥 Movie"}
                        </p>
                        {movie.rip && (
                          <>
                            <span className="text-white/40">•</span>
                            <p className="text-[0.6rem] lg:text-[0.7rem] xl:text-[0.9rem]">
                              🎞️ {movie.rip}
                            </p>
                          </>
                        )}
                        {movie.rating && (
                          <>
                            <span className="text-white/40">•</span>
                            <p className="text-[0.6rem] lg:text-[0.7rem] xl:text-[0.9rem]">
                              ⭐ {(parseFloat(movie.rating) || 0).toFixed(1)}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Genres */}
                      {movie.genres?.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[0.6rem] lg:text-[0.7rem]">🎭</span>
                          {movie.genres.slice(0, 3).map((genreId, index) => (
                            <div
                              className="text-[0.6rem] py-0.5 px-2.5 border border-white/30 text-white/80 rounded-full sm:text-sm capitalize"
                              key={index}
                            >
                              {genreId}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Languages */}
                      {movie.languages?.length > 0 && (
                        <p className="text-[0.6rem] lg:text-[0.7rem] xl:text-[0.9rem]">
                          🌐 {movie.languages
                            .map((lang) => lang.charAt(0).toUpperCase() + lang.slice(1))
                            .join(", ")}
                        </p>
                      )}

                      {/* Description */}
                      {movie.description && (
                        <p className="font-extralight line-clamp-2 w-[85%] text-xs sm:text-sm md:text-md text-white/70">
                          📝 {movie.description}
                        </p>
                      )}

                      {/* Watch Button - Green */}
                      <div className="flex items-center gap-2 mt-2">
                        <Link
                          className="flex items-center gap-2 bg-green-500 border border-green-500 text-white font-bold text-sm py-1 px-5 rounded-full sm:text-base transition-all duration-300 ease-in-out hover:bg-green-600"
                          to={moviePath}
                          style={{ textDecoration: "none" }}
                        >
                          <FaPlay />
                          Watch
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="flex items-center gap-3 mt-5 pl-4 sm:pl-8">
            <BsArrowLeftCircle className="heroSlidePrev text-[2.4rem] text-secondaryTextColor p-2 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:bg-bgColorSecondary hover:text-primaryTextColor" />
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
