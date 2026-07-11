// ─────────────────────────────────────────────────────────────────────────────
// Author  : ThiruXD
// GitHub  : https://github.com/ThiruXD
// Portfolio: https://thiruxd.is-a.dev
// ─────────────────────────────────────────────────────────────────────────────
// Admin: Ratings & Reviews moderation.
// Shows every title that has viewer reviews, lets the admin drill into a title
// and delete individual reviews. Uses axios.defaults Authorization header
// already set by Admin.jsx after login.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { PiStarFill, PiTrashFill, PiArrowLeftBold } from "react-icons/pi";

const BASE = import.meta.env.VITE_BASE_URL;

const AdminReviews = () => {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTitle, setSelectedTitle] = useState(null); // { tmdb_id, media_type, title }
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchTitles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/admin/reviews`);
      setTitles(res.data?.titles || []);
    } catch (e) {
      console.error("Failed to fetch reviewed titles:", e);
      toast.error("Couldn't load reviews list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTitles();
  }, []);

  const openTitle = async (t) => {
    setSelectedTitle(t);
    setReviewsLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/admin/reviews/${t.media_type}/${t.tmdb_id}`);
      setReviews(res.data?.items || []);
    } catch (e) {
      console.error("Failed to fetch reviews:", e);
      toast.error("Couldn't load reviews.");
    } finally {
      setReviewsLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review? This can't be undone.")) return;
    try {
      await axios.delete(`${BASE}/api/admin/reviews/${reviewId}`);
      toast.success("Review deleted.");
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      fetchTitles(); // refresh counts on the list view
    } catch (e) {
      console.error("Failed to delete review:", e);
      toast.error("Couldn't delete review.");
    }
  };

  // ── Detail view: reviews for one title ──────────────────────────────────
  if (selectedTitle) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <button
          onClick={() => setSelectedTitle(null)}
          className="flex items-center gap-2 text-sm font-bold text-secondaryTextColor hover:text-primaryTextColor transition-colors"
        >
          <PiArrowLeftBold /> Back to all reviewed titles
        </button>

        <h2 className="text-xl font-extrabold text-primaryTextColor">
          Reviews for "{selectedTitle.title}"
        </h2>

        {reviewsLoading ? (
          <p className="text-secondaryTextColor text-sm">Loading...</p>
        ) : reviews.length === 0 ? (
          <p className="text-secondaryTextColor text-sm">No reviews left.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="bg-bgColorSecondary dark:bg-white/5 rounded-2xl p-4 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm text-primaryTextColor">{r.reviewer_name}</p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <PiStarFill
                          key={n}
                          className={`text-xs ${n <= r.rating ? "text-yellow-400" : "text-secondaryTextColor/30"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {r.review_text && (
                    <p className="text-sm text-secondaryTextColor break-words">{r.review_text}</p>
                  )}
                  <p className="text-[10px] text-secondaryTextColor/60 mt-1 font-mono">
                    device: {r.owner_id?.slice(0, 18)}...
                  </p>
                </div>
                <button
                  onClick={() => deleteReview(r._id)}
                  className="p-2 rounded-full hover:bg-red-500/10 text-red-500 shrink-0"
                  title="Delete review"
                >
                  <PiTrashFill />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── List view: every title that has reviews ─────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-xl font-extrabold text-primaryTextColor">Ratings &amp; Reviews</h2>

      {loading ? (
        <p className="text-secondaryTextColor text-sm">Loading...</p>
      ) : titles.length === 0 ? (
        <p className="text-secondaryTextColor text-sm">No reviews submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {titles.map((t) => (
            <div
              key={`${t.media_type}-${t.tmdb_id}`}
              onClick={() => openTitle(t)}
              className="flex items-center gap-3 p-3 bg-bgColorSecondary dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-btnColor/20 transition-all"
            >
              <img
                src={t.poster || ""}
                alt={t.title}
                className="w-12 h-16 object-cover rounded-lg bg-btnColor shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-primaryTextColor line-clamp-1">{t.title}</p>
                <p className="text-[10px] uppercase text-secondaryTextColor">{t.media_type}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-yellow-400 text-xs">
                    <PiStarFill /> {t.average_rating}
                  </div>
                  <span className="text-secondaryTextColor text-xs">
                    {t.total_reviews} review{t.total_reviews !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
                                          
