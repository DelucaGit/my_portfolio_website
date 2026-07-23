import Link from "next/link";
import type { Service } from "@/lib/services";
import { getAllServices } from "@/lib/services";
import styles from "./Services.module.css";

export default function Services() {
  const services = getAllServices();

  return (
    <section className={styles.section} aria-labelledby="services-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Tjänster</p>
          <h2 id="services-heading" className={styles.heading}>
            Mjukvara som hjälper affären att växa.
          </h2>
          <p className={styles.support}>
            Välj en del — eller flera. Varje pusselbit fungerar själv, och ännu
            bättre tillsammans.
          </p>
        </header>

        <ul className={styles.grid}>
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.icon} aria-hidden="true">
          <ServiceIcon name={service.icon} />
        </span>
        <p className={styles.price}>{service.price}</p>
      </div>

      <h3 className={styles.title}>{service.title}</h3>
      <p className={styles.pill}>{service.pill}</p>
      <p className={styles.description}>{service.description}</p>

      <ul className={styles.features}>
        {service.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      {!service.comingSoon && (
        <Link href="#contact" className={styles.cta}>
          Hör av dig <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  );
}

function ServiceIcon({ name }: { name: Service["icon"] }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    width: 20,
    height: 20,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "globe":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case "spark":
      return (
        <svg {...props}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
        </svg>
      );
    case "layers":
      return (
        <svg {...props}>
          <path d="M12 3 3 8l9 5 9-5-9-5Z" />
          <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
        </svg>
      );
    case "shop":
      return (
        <svg {...props}>
          <path d="M4 8h16l-1.2 11.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8Z" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 3 5 6v5c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6l-7-3Z" />
          <path d="m9.5 12 1.8 1.8 3.7-3.7" />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...props}>
          <path d="m4 10 14-5v14L4 14v-4Z" />
          <path d="M8 14v4.5a1.5 1.5 0 0 0 2.6 1L14 17" />
        </svg>
      );
  }
}
