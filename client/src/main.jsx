import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import appStore from './app/store'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/ui/theme-provider'
import { useLoadUserQuery } from './features/api/authApi'
import LoadingSpinner from './components/LoadingSpinner'
const Custom =({children})=>{
const {isLoading} =useLoadUserQuery();
return (
<>
{isLoading ? <LoadingSpinner/>:<h1>{children}</h1>}
</>)
} 

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
    <Provider store={appStore}>
 <Custom>
      <App />
    <Toaster/>
    </Custom>
    
    </Provider>
  </StrictMode>,
)
