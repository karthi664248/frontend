// ─────────────────────────────────────────────────────────────────────────────
// Author  : ThiruXD
// GitHub  : https://github.com/ThiruXD
// Portfolio: https://thiruxd.is-a.dev
// ─────────────────────────────────────────────────────────────────────────────
// Ratings & Reviews — anonymous, device_id based (no login required).
// One review per device per title; resubmitting edits your existing review.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { PiStarFill, PiStarBold, PiPencilSimpleBold, PiTrashBold } from "react-icons/pi";
import { useSettings } from "../context/SettingsContext";

const BASE = import.meta.env.VITE_BASE_URL;

const getDeviceId = () => {
  let id = localStorage.getItem("ms_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("ms_device_id", id);
  }
  return id;
};

const StarPicker = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="text-2xl text-yellow-400 transition-transform hover:scale-110"
      >
        {n <= value ? <PiStarFill /> : <PiStarBold />}
      </button>
    ))}
  </div>
);

const ReviewsSection = ({ movieData, mediaType }) => {
  const { settings } = useSettings();
  const ownerId = getDeviceId();
  const tmdbId = movieData?.tmdb_id;
  const resolvedMediaType = mediaType || (movieData?.seasons ? "tv" : "movie");

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState(localStorage.getItem("ms_reviewer_name") || "");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const myReview = reviews.find((r) => r.owner_id === ownerId);

  const fetchReviews = async () => {
    if (!tmdbId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/reviews/${resolvedMediaType}/${tmdbId}`);
      setReviews(res.data?.items || []);
      setAverageRating(res.data?.average_rating || 0);
      setTotalReviews(res.data?.total_reviews || 0);
    } catch (e) {
      console.error("Failed to fetch reviews:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbId]);

  useEffect(() => {
    if (myReview && !isEditing) {
      setName(myReview.reviewer_name || "");
      setRating(myReview.rating || 0);
      setText(myReview.review_text || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myReview]);

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please pick a star rating.");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    setSubmitting(true);
    try {
      localStorage.setItem("ms_reviewer_name", name.trim());
      await axios.post(`${BASE}/api/reviews`, {
        owner_id: ownerId,
        tmdb_id: tmdbId,
        media_type: resolvedMediaType,
        reviewer_name: name.trim(),
        rating,
        review_text: text.trim() || null,
      });
      toast.success(myReview ? "Review updated!" : "Thanks for your review!");
      setIsEditing(false);
      fetchReviews();
    } catch (e) {
      console.error("Failed to submit review:", e);
      toast.error("Couldn't submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE}/api/reviews/${resolvedMediaType}/${tmdbId}/${ownerId}`);
      toast.info("Review removed.");
      setRating(0);
      setText("");
      setIsEditing(false);
      fetchReviews();
    } catch (e) {
      console.error("Failed to delete review:", e);
      toast.error("Couldn't remove your review.");
    }
  };

  if (settings?.showRatingsReviews === false) return null;

  return (
    <div className="mt-8 bg-btnColor/40 p-4 md:p-8 rounded-3xl text-primaryTextColor">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold">Ratings &amp; Reviews</h2>
        {totalReviews > 0 && (
          <div className="flex items-center gap-2 bg-bgColorSecondary dark:bg-white/10 px-4 py-2 rounded-full">
            <PiStarFill className="text-yellow-400 text-lg" />
            <span className="font-bold">{averageRating}</span>
            <span className="text-secondaryTextColor text-sm">
              ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {/* Write / Edit Review Form */}
      {(!myReview || isEditing) && (
        <div className="bg-bgColorSecondary dark:bg-white/5 rounded-2xl p-4 md:p-5 mb-6">
          <p className="text-sm font-semibold mb-3">
            {myReview ? "Edit your review" : "Write a review"}
          </p>
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={40}
              className="flex-1 rounded-lg border border-secondaryTextColor/30 bg-btnColor/40 px-3 py-2 text-sm outline-none"
            />
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Share your thoughts (optional)"
            className="w-full rounded-lg border border-secondaryTextColor/30 bg-btnColor/40 px-3 py-2 text-sm outline-none resize-none mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2 rounded-full bg-otherColor text-bgColor font-bold text-sm disabled:opacity-60"
            >
              {submitting ? "Submitting..." : myReview ? "Update Review" : "Submit Review"}
            </button>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 rounded-full border border-secondaryTextColor/30 text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* My existing review (view mode) */}
      {myReview && !isEditing && (
        <div className="bg-otherColor/10 border border-otherColor/30 rounded-2xl p-4 mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-otherColor font-semibold mb-1">Your review</p>
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <PiStarFill key={n} className={n <= myReview.rating ? "text-yellow-400" : "text-secondaryTextColor/30"} />
              ))}
            </div>
            {myReview.review_text && <p className="text-sm text-secondaryTextColor">{myReview.review_text}</p>}
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-otherColor/10 text-otherColor">
              <PiPencilSimpleBold />
            </button>
            <button onClick={handleDelete} className="p-2 rounded-full hover:bg-red-500/10 text-red-500">
              <PiTrashBold />
            </button>
          </div>
        </div>
      )}

      {/* Review List */}
      {loading ? (
        <p className="text-sm text-secondaryTextColor">Loading reviews...</p>
      ) : reviews.filter((r) => r.owner_id !== ownerId).length === 0 ? (
        <p className="text-sm text-secondaryTextColor">No reviews yet — be the first to share your thoughts!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews
            .filter((r) => r.owner_id !== ownerId)
            .map((r) => (
              <div key={r._id} className="border-b border-secondaryTextColor/10 pb-4 last:border-none">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-sm">{r.reviewer_name}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <PiStarFill key={n} className={`text-sm ${n <= r.rating ? "text-yellow-400" : "text-secondaryTextColor/30"}`} />
                    ))}
                  </div>
                </div>
                {r.review_text && <p className="text-sm text-secondaryTextColor">{r.review_text}</p>}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
        
