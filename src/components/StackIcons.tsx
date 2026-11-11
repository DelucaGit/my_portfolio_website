import { asset } from "@/lib/asset";

/** Official brand marks from Simple Icons, stored in /public/icons */

type StackIconProps = {
  name: string;
  className?: string;
};

const TITLES: Record<string, string> = {
  react: "React",
  java: "Java",
  php: "PHP",
  firebase: "Firebase",
  aws: "Amazon Web Services",
  azure: "Microsoft Azure",
  htmlcss: "HTML5",
  git: "Git",
  jira: "Jira",
  cursor: "Cursor",
  claude: "Claude Code",
  wordpress: "WordPress",
  tailwind: "Tailwind CSS",
  postgresql: "PostgreSQL",
  docker: "Docker",
  restapi: "REST API / OpenAPI",
};

export function StackIcon({ name, className }: StackIconProps) {
  const title = TITLES[name] ?? name;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(`/icons/${name}.svg`)}
      alt=""
      title={title}
      className={className}
      width={24}
      height={24}
      decoding="async"
    />
  );
}
