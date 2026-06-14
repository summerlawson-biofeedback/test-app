import heroImg from '../assets/hero.png'

function Landing() {
  return (
    <section id="center">
      <div className="hero">
        <img src={heroImg} className="base" width="170" height="179" alt="" />
      </div>
      <div>
        <h1 className="leading-snug !text-4xl !my-4">
          <span className="block font-semibold tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            PulsePause
          </span>
          <span className="block mt-1 text-2xl font-light italic tracking-wide text-gray-500 dark:text-gray-400">
            Find your calm, one breath at a time
          </span>
        </h1>
        <p>Welcome to PulsePause — your space to slow down and reset.</p>
      </div>
    </section>
  )
}

export default Landing
