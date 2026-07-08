import { PROFILE, EXPERIENCE, SKILLS, PROJECTS } from "@/lib/data";

/**
 * A complete, semantic, text-only rendering of the portfolio.
 *
 * The visible experience is a WebGL/canvas journey — most of its content
 * (projects, bio, skill detail) never reaches the DOM, so it's invisible to
 * screen readers and to the many AI/search crawlers that don't execute
 * JavaScript. This component mirrors that same content as clean, structured
 * HTML that is always server-rendered into the page.
 *
 * It's visually hidden with `sr-only` (not `display:none`), so assistive tech
 * and crawlers read it while sighted users get the 3D scene. This is a
 * legitimate text alternative to canvas content, not hidden keyword stuffing —
 * it's the exact same information the animated sections present on scroll.
 */
export default function SeoContent() {
  return (
    <section className="sr-only" aria-label={`About ${PROFILE.name}`}>
      <header>
        <h2>
          {PROFILE.name} — {PROFILE.role}
        </h2>
        <p>{PROFILE.status}</p>
        <p>{PROFILE.bio}</p>
      </header>

      <section aria-label="About">
        <h2>About</h2>
        <p>{PROFILE.about.lead}</p>
        <p>{PROFILE.about.p2}</p>
        <p>{PROFILE.about.p3}</p>
        <p>Based in {PROFILE.location}.</p>
      </section>

      <section aria-label="Work experience">
        <h2>Experience</h2>
        {EXPERIENCE.map((job) => (
          <article key={job.company}>
            <h3>
              {job.title} — {job.company}
            </h3>
            <p>
              {job.range} · {job.location}
            </p>
            <p>{job.blurb}</p>
            <ul>
              {job.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section aria-label="Projects">
        <h2>Projects</h2>
        {PROJECTS.map((project) => (
          <article key={project.id}>
            <h3>
              {project.link ? (
                <a href={project.link} rel="noopener">
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h3>
            <p>
              {project.meta} — {project.tagline}
            </p>
            <p>{project.description}</p>
            <p>Built with: {project.tags.join(", ")}.</p>
          </article>
        ))}
      </section>

      <section aria-label="Skills">
        <h2>Skills</h2>
        <ul>
          {SKILLS.map((skill) => (
            <li key={skill.num}>
              <strong>{skill.name}:</strong> {skill.items}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Education and credentials">
        <h2>Education &amp; Credentials</h2>
        <ul>
          {PROFILE.about.credentials.map((credential, i) => (
            <li key={i}>{credential}</li>
          ))}
        </ul>
      </section>

      <section aria-label="Contact">
        <h2>Contact</h2>
        <p>
          Email:{" "}
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </p>
        <p>Location: {PROFILE.location}</p>
        <ul>
          <li>
            <a href={PROFILE.socials.github} rel="noopener">
              GitHub
            </a>
          </li>
          <li>
            <a href={PROFILE.socials.linkedin} rel="noopener">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={PROFILE.socials.medium} rel="noopener">
              Medium
            </a>
          </li>
          <li>
            <a href={PROFILE.resume}>Résumé (PDF)</a>
          </li>
        </ul>
      </section>
    </section>
  );
}
