export default function RegisterPage() {
  return (
    <main>
      <section className="card" style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1>Ro&#39;yxatdan o&#39;tish</h1>
        <p className="muted">Bu sahifa vaqtinchalik. Keyingi bosqichda talaba va admin uchun alohida registratsiya oqimlarini qo&#39;shamiz.</p>

        <div className="grid grid-2">
          <div>
            <label htmlFor="fullname">To&#39;liq ism</label>
            <input id="fullname" placeholder="Ism Familiya" />
          </div>
          <div>
            <label htmlFor="phone">Telefon</label>
            <input id="phone" placeholder="+998 90 000 00 00" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="talaba@example.uz" />
          </div>
          <div>
            <label htmlFor="password">Parol</label>
            <input id="password" type="password" placeholder="********" />
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <button className="btn btn-primary" type="button">
            Davom etish
          </button>
        </div>
      </section>
    </main>
  );
}
