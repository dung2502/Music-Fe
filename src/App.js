import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import routes, {adminRoutes, userRoutes} from './routes';
import PrivateRoute from './utils/PrivateRoute';
import './assets/styles/global.scss';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {PlayMusicProvider} from "./core/contexts/PlayMusicContext";
import LayoutHome from "./layouts/LayoutHome";
import LayoutDashboard from "./layouts/LayoutDashboard";
import LoginPage from "./pages/Login/LoginPage";
import {PopUpProvider} from "./core/contexts/PopUpContext";
import NotFound from "./pages/NotFound/NotFound";
import {ForgotPassword} from "./pages/Login/ForgotPassword/ForgotPassword";
import {CheckEmail} from "./pages/Login/ForgotPassword/CheckEmail";

AOS.init();

function App() {
    return (
        <PlayMusicProvider>
            <PopUpProvider>
                <PlayMusicProvider>
                    <div id="popup-root"></div>
                    <Router>
                        <Routes>
                            <Route path="/" element={<LayoutHome/>}>
                                {userRoutes.map((route, index) => {
                                    if (route.private) {
                                        return (
                                            <Route
                                                key={index}
                                                path={route.path}
                                                element={<PrivateRoute element={route.component}/>}
                                            />
                                        );
                                    }

                                    return (
                                        <Route
                                            key={index}
                                            path={route.path}
                                            element={route.component}
                                        />
                                    );
                                })}
                            </Route>
                            <Route path="/dashboard" element={<LayoutDashboard/>}>
                                {adminRoutes.map((route, index) => {
                                    if (route.private) {
                                        return (
                                            <Route
                                                key={index}
                                                path={route.path}
                                                element={<PrivateRoute element={route.component}/>}
                                            />
                                        );
                                    }

                                    return (
                                        <Route
                                            key={index}
                                            path={route.path}
                                            element={route.component}
                                        />
                                    );
                                })}
                            </Route>
                            <Route path={"/login"} element={<LoginPage/>}/>
                            <Route path={"/check-email"} element={<CheckEmail/>}/>
                            <Route path={"/forgot-password"} element={<ForgotPassword/>}/>
                            <Route path={"*"} element={<NotFound/>}/>
                        </Routes>
                    </Router>
                </PlayMusicProvider>
            </PopUpProvider>
        </PlayMusicProvider>
    );
}

export default App;
