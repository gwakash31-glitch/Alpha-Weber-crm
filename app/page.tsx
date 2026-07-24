export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">

      <section className="premium-card max-w-4xl w-full mx-5 shadow-2xl">

        <div className="text-center space-y-6">

          <h1 className="text-5xl font-bold text-gradient">
            Alpha Weber CRM
          </h1>

          <p className="text-lg text-slate-300">
            Premium Business Growth Operating System
          </p>

          <p className="text-slate-400">
            Production Ready Foundation Successfully Created.
          </p>

          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
            mt-10
            "
          >
            <div className="glass rounded-3xl p-6">

              <h2 className="text-xl font-semibold mb-3">
                CRM System
              </h2>

              <p className="text-slate-400">
                Lead Management, Client Management and
                Campaign Tracking.
              </p>

            </div>

            <div className="glass rounded-3xl p-6">

              <h2 className="text-xl font-semibold mb-3">
                Future Ready
              </h2>

              <p className="text-slate-400">
                WhatsApp Integration, AI Assistant,
                Automation and Analytics.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}