"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./reviews.module.css";
import TypewriterHeadline from "./TypewriterHeadline";

interface Review {
  id: number;
  quote: string[];      // paragraphs
  author: string;
  role: string;
  company: string;
  relation: string;     // e.g. "was Marcel's client"
  date: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: 1,
    quote: [
      "I've had the pleasure of working with Marcel on two different projects, where he developed two websites for my companies, and I can highly recommend him as a web developer.",
      "Marcel is extremely professional in his work and has an impressive ability to solve problems quickly and efficiently. No matter the challenge, he always finds solutions that work, often exceeding expectations.",
      "Beyond his technical skills, Marcel is also very easy to work with. He is communicative, attentive, and ensures that projects run smoothly from start to finish.",
      "I look forward to working with him again in the future.",
    ],
    author: "Sami Fakhro",
    role: "Remote Center Operatör",
    company: "Caverion",
    relation: "Sami was Marcel's client",
    date: "April 2, 2026",
    avatar: "/reviews/sami-fakhro-avatar.png",
  },
  {
    id: 2,
    quote: [
      "I've worked with Marcel during 2025–2026 when he built a brand new website for us. He went the extra mile to make sure the goals were delivered on time and we've already started making sales through the website.",
      "Working with Marcel has been more than just a partnership — it has been a friendship where we check up on each other and talk about life outside business.",
      "I recommend him to larger businesses that look for honesty put in work.",
    ],
    author: "Fredrik Strand",
    role: "Strategic Procurement Executive",
    company: "Stealth Venture",
    relation: "Fredrik was Marcel's client",
    date: "April 1, 2026",
    avatar: "/reviews/fredrik-strand-avatar.png",
  },
];

const QUOTE_SPEED = 12;

/** Types out the full review text (all paragraphs joined) and splits on \n\n to render breaks naturally. */
function TypedReview({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    let iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, QUOTE_SPEED);
    }, 180);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text]);

  const paragraphs = displayed.split("\n\n");

  return (
    <div className={styles.quoteBody}>
      {paragraphs.map((para, i) => (
        <p key={i} className={styles.quotePara}>
          <span aria-hidden="true">
            {para}
            {/* cursor only on the last (actively typing) paragraph */}
            {i === paragraphs.length - 1 && <span className={styles.quoteCursor} />}
          </span>
        </p>
      ))}
      {/* Full text for screen readers */}
      <span className={styles.srOnly}>{text}</span>
    </div>
  );
}

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const review = reviews[activeIndex];
  const fullText = review.quote.join("\n\n");

  return (
    <section id="reviews" className={styles.section} aria-label="Client reviews">
      <div className={styles.inner}>

        {/* ── Left column ── */}
        <div className={styles.leftCol}>
          <p className={styles.eyebrow}>Kind words</p>
          <TypewriterHeadline
            text="What clients are saying"
            as="h2"
            className={styles.heading}
            cursorClassName={styles.headingCursor}
            startDelay={200}
          />
          <p className={styles.sub}>
            Real recommendations from LinkedIn — hear directly from the people I&apos;ve had the privilege to work with.
          </p>

          <div className={styles.controls}>
            <button
              className={styles.arrowBtn}
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous review"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className={styles.dots} role="tablist">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeIndex}
                  className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`View review ${i + 1}`}
                />
              ))}
            </div>
            <button
              className={styles.arrowBtn}
              onClick={() => setActiveIndex((i) => Math.min(reviews.length - 1, i + 1))}
              disabled={activeIndex === reviews.length - 1}
              aria-label="Next review"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Right column: coded review card ── */}
        <article key={activeIndex} className={styles.card} aria-label={`Review by ${review.author}`}>

          {/* Header: avatar + name + meta */}
          <div className={styles.cardHeader}>
            <div className={styles.avatarWrap}>
              <Image
                src={review.avatar}
                alt={`${review.author} profile photo`}
                width={56}
                height={56}
                className={styles.avatar}
              />
            </div>
            <div className={styles.authorInfo}>
              <div className={styles.authorTop}>
                <span className={styles.authorName}>{review.author}</span>
                <span className={styles.linkedinBadge} aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  · 1st
                </span>
              </div>
              <span className={styles.authorRole}>{review.role} · {review.company}</span>
              <span className={styles.reviewMeta}>{review.date} · {review.relation}</span>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Review body — full text typed as one stream */}
          <TypedReview key={activeIndex} text={fullText} />

        </article>

      </div>
    </section>
  );
}
