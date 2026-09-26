import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <span className="brand">Fetify</span>
      <span>
        Le carnet d&apos;adresses des grands jours ·{" "}
        <Link href="/inscription">Devenir prestataire</Link>
      </span>
      <span>&copy; {new Date().getFullYear()} Fetify</span>
    </footer>
  );
}
