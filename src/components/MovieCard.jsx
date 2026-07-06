// ─────────────────────────────────────────────────────────────────────────────
// Author  : ThiruXD
// GitHub  : https://github.com/ThiruXD
// Portfolio: https://thiruxd.is-a.dev
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/black-and-white.css";
import { PiStarFill, PiPencilSimpleFill, PiFilmSlateFill, PiTelevisionFill } from "react-icons/pi";

import { BsPlayFill } from "react-icons/bs";
import posterPlaceholder from "../assets/images/poster-placeholder.png";
import { useSettings } from "../context/SettingsContext";

const slugify = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const MovieCard = ({ movie }) => {
  const { settings } = useSettings();
  const [showPlayBtn, setShowPlayBtn] = useState(false);
  const [openId, setOpenId] = useState();

  const showPlay = () => {
    setOpenId(movie.tmdb_id);
    setShowPlayBtn(true);
  };

  const hidePlay = () => {
    setOpenId(movie.tmdb_id);
    setShowPlayBtn(false);
  };

  return (
    <div className="relative">
      <Link
        to={
            movie.media_type === "movie"
                ? `/mov/${movie.tmdb_id}/${movie.slug || slugify(movie.title)}`
                : `/ser/${movie.tmdb_id}/${movie.slug || slugify(movie.title)}`
        }
        className="rounded-t-2xl"
      >
        <div className="flex items-center justify-center aspect-[9/13.5] w-full object-cover rounded-2xl ">
          <LazyLoadImage
            src={movie.poster ? movie.poster : posterPlaceholder}
            width="100%"
            effect="black-and-white"
            alt={movie.title}
            className="aspect-[9/13.5] w-full object-cover rounded-2xl "
            onMouseEnter={showPlay}
            onMouseLeave={hidePlay}
          />
        </div>
      </Link>

      <div className="text-primaryTextColor mt-2 flex flex-col gap-1">
        {/* Title */}
        <p className="line-clamp-1 text-md md:text-base font-bold">{movie.title}</p>

        {/* Year • Type • IMDB */}
        <div className="flex items-center gap-1 flex-wrap text-secondaryTextColor text-[0.55rem] sm:text-[0.65rem]">
          {movie.release_year && <span>📅 {movie.release_year}</span>}
          <span className="text-white/30">•</span>
          <span>{movie.media_type === "movie" ? "🎥 Movie" : "📺 Series"}</span>
          {movie.rating && (
            <>
              <span className="text-white/30">•</span>
              <span>⭐ {(parseFloat(movie.rating) || 0).toFixed(1)}</span>
            </>
          )}
        </div>

        {/* Languages */}
        {movie.languages && movie.languages.length > 0 && (
          <p className="text-secondaryTextColor text-[0.55rem] sm:text-[0.65rem] line-clamp-1">
            🌐 {movie.languages.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(", ")}
          </p>
        )}

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[0.55rem]">🎭</span>
            {movie.genres.slice(0, 3).map((g, i) => (
              <span key={i} className="text-secondaryTextColor text-[0.5rem] sm:text-[0.6rem]">
                #{g}
              </span>
            ))}
          </div>
        )}
      </div>

      {movie.rating ? (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[0.65rem] sm:text-xs py-1 px-2 rounded-md z-10 backdrop-blur-sm shadow-sm border border-white/10">
          <PiStarFill className="text-yellow-400 text-[0.7rem] sm:text-sm" />
          <p className="font-semibold tracking-wide">
            {typeof movie.rating === 'number' 
              ? movie.rating.toFixed(1) 
              : !isNaN(parseFloat(movie.rating)) 
                ? parseFloat(movie.rating).toFixed(1) 
                : '0.0'}
          </p>
        </div>
      ) : (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[0.65rem] sm:text-xs py-1 px-2 rounded-md z-10 backdrop-blur-sm shadow-sm border border-white/10">
          <PiStarFill className="text-yellow-400 text-[0.7rem] sm:text-sm" />
          <p className="font-semibold tracking-wide">0.0</p>
        </div>
      )}

      {/* Media type badge — top-right, replaces the old bottom-right language pill */}
      <div className="flex items-center gap-1 absolute top-2 right-2 bg-black/60 text-white py-1 px-2 rounded-md z-10 backdrop-blur-sm shadow-sm border border-white/10 font-semibold text-[0.6rem] sm:text-xs uppercase">
        {movie.media_type === "movie" ? (
          <PiFilmSlateFill className="text-[0.7rem] sm:text-sm text-yellow-400" />
        ) : (
          <PiTelevisionFill className="text-[0.7rem] sm:text-sm text-yellow-400" />
        )}
        <p>{movie.media_type === "movie" ? "Movie" : "Series"}</p>
      </div>

      {sessionStorage.getItem("adminAuth") === "true" && (
        <Link
          to={`/admin?tmdb_id=${movie.tmdb_id}&type=${movie.media_type}`}
          className="absolute top-11 right-2 flex items-center gap-1 bg-primaryBtn text-white text-[0.65rem] sm:text-xs py-2 px-2 rounded-md z-20 backdrop-blur-sm shadow-lg border border-white/20 hover:scale-110 transition-transform"
          title="Edit Details"
        >
          <PiPencilSimpleFill className="text-[0.7rem] sm:text-sm" />
        </Link>
      )}

      {movie.rip && movie.rip !== "Unknown" && (
        <div className="flex items-center gap-1 absolute bottom-16 left-3 bg-black/70 text-white py-1 px-2.5 rounded-md z-10 backdrop-blur-sm shadow-sm border border-white/10 font-semibold tracking-wide text-[0.6rem] sm:text-xs">
          <p>{movie.rip}</p>
        </div>
      )}

      <AnimatePresence>
        {settings.showCardPlayButton !== false && settings.showCardPlayButton !== "false" && openId === movie.tmdb_id && showPlayBtn && (
          <Link
            to={
              movie.media_type === "movie"
                ? `/mov/${movie.tmdb_id}/${movie.slug || slugify(movie.title)}`
                : `/ser/${movie.tmdb_id}/${movie.slug || slugify(movie.title)}`
            }
            onMouseEnter={showPlay}
            onMouseLeave={hidePlay}
            className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primaryBtn sm:block"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{
                type: "tween",
                duration: 0.3,
              }}
              className="text-3xl p-1 rounded-full border-4 border-primaryBtn"
            >
              <BsPlayFill />
            </motion.div>
          </Link>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieCard;
