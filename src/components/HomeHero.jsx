import React, { useState } from "react";
import { Star, Play, ChevronLeft, ChevronRight } from "lucide-react";

// Same visual design as the updated HomeHero.jsx — sample data only,
// so you can eyeball brightness / alignment / button style before
// dropping the real file into the project.

const ACCENT_COLOR = "#22c55e";

const SAMPLE_MOVIES = [
  {
    title: "Godzilla",
    genre: "Action",
    year: 2014,
    languages: "English-Hindi-Tamil-Telugu",
    rip: "Unknown",
    rating: 3,
    backdrop: "https://picsum.photos/seed/godzilla-kaiju/1200/500",
  },
  {
    title: "Spy x Family",
    genre: "Animation",
    year: 2022,
    languages: "English-Hindi-Jpn-Tamil-Telugu",
    rip: "Unknown",
    rating: 4,
    backdrop: "https://picsum.photos/seed/spyfamily-anime/1200/500",
  },
  {
    title: "The Witcher",
    genre: "Drama",
    year: 2019,
    languages: "English",
    rip: "Unknown",
    rating: 4,
    backdrop: "https://picsum.photos/seed/witcher-fantasy/1200/500",
  },
];

function StarRating({ value = 0, max = 5 }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[0.5rem] sm:text-[0.6rem] uppercase tracking-[0.15em] text-white/50">
        Rating
      </span>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={i < value ? "fill-yellow-400 text-yellow-400" : "text-white/25"}
          />
        ))}
      </div>
    </div>
  );
}

export default function HeroPreview() {
  const [index, setIndex] = useState(0);
  const movie = SAMPLE_MOVIES[index];

  const next = () => setIndex((i) => (i + 1) % SAMPLE_MOVIES.length);
  const prev = () => setIndex((i) => (i - 1 + SAMPLE_MOVIES.length) % SAMPLE_MOVIES.length);

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center gap-6 p-6">
      <section className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-neutral-950 text-white min-h-[380px] sm:min-h-[420px] md:h-96">
        {/* Backdrop image */}
        <div className="absolute inset-0">
          <img
            src={movie.backdrop}
            className="h-full w-full object-cover object-right brightness-125 contrast-105 saturate-110"
            alt={movie.title}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/15 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-center gap-1.5 sm:gap-3 p-4 sm:p-8 md:p-10 max-w-xl overflow-hidden">
          <span className="text-[0.6rem] sm:text-xs uppercase tracking-[0.2em] text-white/60">
            {movie.genre}
          </span>

          <h1 className="text-lg sm:text-3xl md:text-4xl font-bold leading-tight break-words">
            {movie.title}
          </h1>

          <div className="flex items-center gap-2">
            <StarRating value={movie.rating} />
            <span className="text-[0.65rem] sm:text-xs text-white/70 font-semibold">
              {movie.rating.toFixed(1)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6rem] sm:text-xs md:text-sm text-white/60 pr-2">
            <span>{movie.year}</span>
            <span>•</span>
            <span className="break-words">{movie.languages}</span>
            <span>|</span>
            <span>{movie.rip}</span>
          </div>

          <button
            style={{
              backgroundColor: ACCENT_COLOR,
              boxShadow: `0 0 14px 2px ${ACCENT_COLOR}99, 0 0 32px 6px ${ACCENT_COLOR}55`,
            }}
            className="mt-1 relative inline-flex w-fit items-center rounded-full pl-4 pr-1.5 py-1.5 sm:pl-5 sm:pr-2 sm:py-2 text-xs sm:text-sm font-bold text-white transition-all hover:scale-105 hover:brightness-110 active:scale-95 animate-pulse-glow"
          >
            <span className="mr-6 sm:mr-8">Watch Online</span>
            <span className="absolute right-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white text-black">
              <Play size={11} className="ml-0.5 fill-current" />
            </span>
          </button>
        </div>
      </section>

      {/* Sample switcher — not part of the real component, just for previewing */}
      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-white/60 text-sm">
          {index + 1} / {SAMPLE_MOVIES.length} sample slides
        </span>
        <button
          onClick={next}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 14px 2px ${ACCENT_COLOR}99, 0 0 32px 6px ${ACCENT_COLOR}55;
          }
          50% {
            box-shadow: 0 0 20px 4px ${ACCENT_COLOR}cc, 0 0 44px 10px ${ACCENT_COLOR}80;
          }
        }
        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
