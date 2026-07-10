// ─────────────────────────────────────────────────────────────────────────────
// Report Broken Link modal — sends viewer-reported issues to the backend,
// which forwards them to your Telegram REPORT_CHANNEL.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import { PiFlagBold } from "react-icons/pi";

const ISSUES = [
  "Video not playing",
  "Audio missing",
  "Wrong audio language",
  "Wrong subtitle",
  "Poor video quality",
  "Wrong movie/episode",
  "Buffering / slow loading",
  "Other",
];

const getOrCreateDeviceId = () => {
  let id = localStorage.getItem("ms_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("ms_device_id", id);
  }
  return id;
};

const ReportIssueModal = ({ isOpen, onClose, movieData, mediaType }) => {
  const [issue, setIssue] = useState(ISSUES[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const BASE = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async () => {
    if (!movieData?.tmdb_id) {
      toast.error("Missing title info, please try again.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${BASE}/api/report`, {
        device_id: getOrCreateDeviceId(),
        tmdb_id: movieData.tmdb_id,
        media_type: mediaType || (movieData.seasons ? "tv" : "movie"),
        title: movieData.title,
        issue,
        message: message.trim() || null,
      });
      toast.success("Thanks! We've received your report.");
      setMessage("");
      setIssue(ISSUES[0]);
      onClose();
    } catch (err) {
      console.error("Error submitting report:", err);
      toast.error("Couldn't submit the report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <PiFlagBold className="text-red-500" />
              Report an Issue
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-secondaryTextColor mb-1">
                {movieData?.title}
              </p>

              <label className="text-xs font-semibold text-secondaryTextColor mb-1">
                What's wrong?
              </label>
              <select
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="w-full rounded-lg border border-secondaryTextColor/30 bg-bgColorSecondary dark:bg-white/10 px-3 py-2 text-sm text-primaryTextColor outline-none"
              >
                {ISSUES.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>

              <label className="text-xs font-semibold text-secondaryTextColor mt-3 mb-1">
                Additional details (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="e.g. Episode 4 audio cuts out at 12:30"
                className="w-full rounded-lg border border-secondaryTextColor/30 bg-bgColorSecondary dark:bg-white/10 px-3 py-2 text-sm text-primaryTextColor outline-none resize-none"
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={close}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={submitting}
                onPress={handleSubmit}
              >
                Submit Report
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ReportIssueModal;

