import Link from "next/link";
import type { Project } from "@/lib/projects";

type ProjectCaseStudyProps = {
  project: Project;
};

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const { detail } = project;

  return (
    <article>
      <p>
        <Link href="/#work">← Back to work</Link>
      </p>

      <header>
        <h1>{project.name}</h1>
        <p>{project.tagline}</p>
        <p>{project.year}</p>
      </header>

      <section>
        <h2>Overview</h2>
        {detail.overview.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      {detail.challenge && (
        <section>
          <h2>Challenge</h2>
          {detail.challenge.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      )}

      {detail.solution && (
        <section>
          <h2>Solution</h2>
          {detail.solution.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      )}

      {detail.results && (
        <section>
          <h2>Results</h2>
          {detail.results.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      )}

      <section>
        <h2>Tech stack</h2>
        <ul>
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {detail.gallery && detail.gallery.length > 0 && (
        <section>
          <h2>Gallery</h2>
          {detail.gallery.map((image) => (
            <figure key={image.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt={image.alt} />
            </figure>
          ))}
        </section>
      )}

      <p>
        {project.siteUrl && (
          <a href={project.siteUrl} target="_blank" rel="noopener noreferrer">
            View live site
          </a>
        )}
        {project.siteUrl && project.githubUrl && " · "}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            View source
          </a>
        )}
      </p>
    </article>
  );
}
