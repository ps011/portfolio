import Meta from '../components/meta/meta'

export default function Home() {
  return (
    <div className="container">
      <Meta
        name="Prasheel Soni"
        title="Prasheel Soni - Full Stack Engineer"
        desc="Prasheel Soni - FullStackEngineer"
      />
      <main>
        <h1>This is my personal website. Under development</h1>
      </main>
      <style jsx global>
        {`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: 'Comfortaa', cursive;
  }

  * {
    box-sizing: border-box;
  }
`}
      </style>

    </div>
  )
}
