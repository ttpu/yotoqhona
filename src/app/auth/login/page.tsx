export default function LoginPage() {
  return (
    <main>
      <section className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1>Kirish</h1>
        <p className="muted">Bu sahifa vaqtinchalik. Keyingi bosqichda autentifikatsiya talablari bo&#39;yicha to&#39;liq sozlaymiz.</p>

        <div className="grid" style={{ gap: 10 }}>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="talaba@example.uz" />
          </div>
          <div>
            <label htmlFor="password">Parol</label>
            <input id="password" type="password" placeholder="********" />
          </div>
          <button className="btn btn-primary" type="button">
            Kirish
          </button>
        </div>
      </section>
    </main>
  );
}
