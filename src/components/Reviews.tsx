"use client";

import { useState } from "react";
import { getAllReviews } from "@/lib/reviews";
import styles from "./Reviews.module.css";

export default function Reviews() {
  const reviews = getAllReviews();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeReview = reviews[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((index) => (index === 0 ? reviews.length - 1 : index - 1));
  };

  const goToNext = () => {
    setActiveIndex((index) => (index === reviews.length - 1 ? 0 : index + 1));
  };

  return (
    <section className={styles.section} aria-labelledby="reviews-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>What people say</p>
          <h2 id="reviews-heading" className={styles.heading}>
            Reviews
          </h2>
        </header>

        {/* key={activeReview.id} restarts the fade-in animation each
            time the review changes, and aria-live announces the new
            review to screen readers. */}
        <div className={styles.card} key={activeReview.id} aria-live="polite">
          <div className={styles.cardHeader}>
            <div className={styles.avatarWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeReview.avatar}
                alt={activeReview.author}
                className={styles.avatar}
              />
              <span className={styles.linkedinBadge} aria-hidden="true">
                in
              </span>
            </div>

            <div>
              <p className={styles.author}>{activeReview.author}</p>
              <p className={styles.roleCompany}>
                {activeReview.role} at {activeReview.company}
              </p>
            </div>
          </div>

          <p className={styles.relation}>
            {activeReview.relation} · {activeReview.date}
          </p>

          <div className={styles.quote}>
            {activeReview.quote.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={goToPrevious}
            aria-label="Previous review"
          >
            ←
          </button>

          <p className={styles.counter}>
            {activeIndex + 1} / {reviews.length}
          </p>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={goToNext}
            aria-label="Next review"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
