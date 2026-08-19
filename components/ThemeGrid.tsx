import { ThemeIcon } from "@/components/ThemeIcons";
import { investingThemes } from "@/lib/content";

export function ThemeGrid() {
  return (
    <ul className="theme-grid">
      {investingThemes.map((theme) => (
        <li key={theme.id} className="theme-cell">
          <ThemeIcon id={theme.id} />
          <span>{theme.label}</span>
        </li>
      ))}
    </ul>
  );
}
