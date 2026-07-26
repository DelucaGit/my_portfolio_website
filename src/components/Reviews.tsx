"use client";

import { useState } from "react";
import { getAllReviews } from "@/lib/reviews";
import { asset } from "@/lib/asset";
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
        <div className={styles.layout}>
          <header className={styles.textCol}>
            <p className={styles.eyebrow}>Omdömen</p>
            <h2 id="reviews-heading" className={styles.heading}>
              Vad kunderna säger om samarbetet.
            </h2>
          </header>

          <div className={styles.reviewCol}>
            {/* key={activeReview.id} restarts the fade-in when the
                review changes; aria-live announces it to screen readers. */}
            <div
              className={styles.cardGlow}
              key={activeReview.id}
              aria-live="polite"
            >
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatarWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(activeReview.avatar)}
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
                      {activeReview.role} på {activeReview.company}
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
            </div>

            <div className={styles.controls}>
              <button
                type="button"
                className={styles.controlBtn}
                onClick={goToPrevious}
                aria-label="Föregående omdöme"
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
                aria-label="Nästa omdöme"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
