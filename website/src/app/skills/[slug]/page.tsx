import { notFound } from "next/navigation";
import { skills, installBase } from "../../../data/skills";
import CopyButton from "../../../components/CopyButton";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return skills.map((skill) => ({ slug: skill.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const skill = skills.find((s) => s.slug === slug);
  return {
    title: skill ? skill.name + " — Pixelcraft" : "Skill not found",
    description: skill?.summary,
  };
}
export default async function SkillPage({ params }: Props) {
  const { slug } = await params;
  const skill = skills.find((s) => s.slug === slug);
  if (!skill) notFound();
  const related = skills
    .filter((s) => s.category === skill.category && s.slug !== skill.slug)
    .slice(0, 4);
  return (
    <>
      <header className="page-hero shell">
        <div className="breadcrumbs">
          <a href="/">Pixelcraft</a>
          <span>/</span>
          <a href="/#skills">Skills</a>
          <span>/</span>
          <span>{skill.slug}</span>
        </div>
        <span
          className={`category-label category-${skill.category.toLowerCase()}`}
        >
          {skill.category} / v0.1.0
        </span>
        <h1>{skill.name}</h1>
        <p>{skill.summary}</p>
      </header>
      <div className="reading-layout shell">
        <aside className="reading-sidebar">
          <span>THIS SKILL</span>
          <a href="#instructions">Read instructions</a>
          <a href="#install-skill">Install</a>
          <a href={skill.sourceUrl}>View source ↗</a>
          <a href="/guide/">Setup guide ↗</a>
          <a className="sidebar-back" href="/#skills">
            ← All skills
          </a>
        </aside>
        <article className="prose">
          <div className="skill-source-line">
            <span>FROM THE REPOSITORY / SKILL.md</span>
            <a href={skill.sourceUrl}>Read on GitHub ↗</a>
          </div>
          <div
            id="instructions"
            dangerouslySetInnerHTML={{ __html: skill.html }}
          />
          <h2 id="install-skill">Bring this skill to your project</h2>
          <p>
            Choose this skill in the interactive picker, or install it directly
            with the skills CLI:
          </p>
          <div className="command-box">
            <span aria-hidden="true">$</span>
            <code id="skill-command">{`${installBase} --skill ${skill.name}`}</code>
            <CopyButton
              target="skill-command"
              label="Copy skill install command"
            />
          </div>
          <p>
            For a full workflow, also install{" "}
            <a href="/skills/pixelcraft/">pixelcraft</a> and{" "}
            <a href="/skills/plan/">pixelcraft-plan</a>.{" "}
            <a href="/guide/">Read the setup guide</a> for the bundled
            installer, host-specific paths, and subset behavior.
          </p>
          <section className="related-skills">
            <h3>Keep exploring</h3>
            <div>
              {related.map((s) => (
                <a key={s.slug} href={`/skills/${s.slug}/`}>
                  {s.name} ↗
                </a>
              ))}
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
