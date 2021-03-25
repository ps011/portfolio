import Header from '../components/header/header'
import Meta from '../components/meta/meta'

export default function Home() {
  return (
    <div>
      <Meta
        name="Prasheel Soni"
        title="Prasheel Soni - Full Stack Engineer"
        desc="Prasheel Soni - FullStackEngineer"
      />
      <Header logoUrl="/images/logos/logo.png" />
      <main>
        <h1>This is my personal website. Under development</h1>
      </main>
    </div>
  )
}
