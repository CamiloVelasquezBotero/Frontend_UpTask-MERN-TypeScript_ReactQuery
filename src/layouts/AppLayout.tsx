import { Link, Outlet, Navigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' /* Estilos para react-toastify */
import Logo from "@/components/Logo"
import NavMenu from "@/components/NavMenu"
import { useAuth } from "@/hooks/useAuth"

export default function AppLayout() {

    const { data, isError, isLoading } = useAuth() // Extraemos los que retornamos del hook

    if(isLoading) return 'Cargando...'
    if(isError) {
        return <Navigate to={'/auth/login'}/> // SI no esta registrado entonces enviamos al usuario a logearse
    }

  if(data) return ( /* Si tenemos algo en data retornamos */
    <>
        <header className="bg-gray-800 py-5">
            <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
                <div className="w-64">
                    <Link to={'/'}>
                        <Logo />
                    </Link>
                </div>

                 <NavMenu 
                    name={data.name}
                 />
            </div>
        </header>
    
        <section className="max-w-screen-2xl mx-auto p-5">
            <Outlet />
        </section>

        <footer className="py-5">
            <p className="text-center">Todos los derechos reservados {new Date().getFullYear()}</p>
        </footer>

        <ToastContainer 
            pauseOnHover={false} /* No se pausa si estamos encima dl toast */
            pauseOnFocusLoss={false}
            theme='dark'
        />
    </>
  )
}
