import {Routes, Route, Outlet} from 'react-router-dom';
import {Sidenav, DashboardNavbar} from '@/widgets/layout';
import routes from '@/routes';
import {useMaterialTailwindController, } from '@/context';
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function Dashboard () {

  const { isLoggedIn } = useSelector(state => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/auth/sign-in" />;
  }
  
  const [controller, ] = useMaterialTailwindController ();
  const {sidenavType} = controller; //nilai sidenav diambil dari controller

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes} //berisi daftar rute yg ada dalam aplikasi
        brandImg={sidenavType === 'dark' ? '/img/logo.png' : '/img/logo.png'}
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Routes>
          {routes.map (
            ({layout, pages}) =>
              layout === 'dashboard' &&
              pages.map (({path, element}) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
      </div>
    </div>
  );
}

Dashboard.displayName = '/src/layout/dashboard.jsx';

export default Dashboard;
