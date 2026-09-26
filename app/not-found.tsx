import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-body">
      <div className="card narrow" style={{ textAlign: "center" }}>
        <p className="eyebrow">Page introuvable</p>
        <h1 style={{ fontSize: "2rem", margin: "10px 0 16px" }}>Cette page n&apos;existe pas</h1>
        <Link className="btn btn-primary" href="/">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
