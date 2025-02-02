import Footer from './Components/Footer'
import Manager from './Components/Manager'
import Navbar from './Components/Navbar'

function App() {

  return (
    <>
      <Navbar />
      
      <div className='bg-gradient-to-tr from-blue-100 to-blue-50 min-h-[calc(100vh-100px)]'>
        <Manager />
      </div>

      <Footer />
    </>
  )
}

export default App