import { GenesisBanners } from "@/components/GenesisBanners";

export default function GenesesPage() {
  return (
    <main className="cs-wrap" style={{ paddingTop: 44 }}>
      <span className="cs-kicker">Genesis</span>
      <h1 className="cs-h1" style={{ margin: "10px 0 8px" }}>Geneses</h1>
      <p className="cs-lede" style={{ marginBottom: 28 }}>Whole apps built 100% with Rebar UI.</p>
      <GenesisBanners />
    </main>
  );
}
