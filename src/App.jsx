import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import Login from "./pages/Login/Login";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Auteur from "./pages/actualites/Auteur/Auteur";
import CategorieActualite from "./pages/actualites/CategorieActualite/CategorieActualite";
import Actualite from "./pages/actualites/actualite/Actualite";

import Region from "./pages/realisations/Region/Region";
import District from "./pages/realisations/District/District";
import Commune from "./pages/realisations/Commune/Commune";
import CategorieRealisation from "./pages/realisations/CategorieRealisation/CategorieRealisation";
import SourceFinancement from "./pages/realisations/SourceFinancement/SourceFinancement";
import Programme from "./pages/realisations/Programme/Programme";
import Realisation from "./pages/realisations/Realisation/Realisation";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                    
                        <Route path="/auteurs" element={<Auteur />} />
                        <Route path="/categories-actualites" element={<CategorieActualite />} />
                        <Route path="/actualites" element={<Actualite />} />

                        <Route path="/regions" element={<Region />} />
                        <Route path="/districts" element={<District />} />
                        <Route path="/communes" element={<Commune />} />
                        <Route path="/categories-realisations" element={<CategorieRealisation />} />
                        <Route path="/sources-financement" element={<SourceFinancement />} />
                        <Route path="/programmes" element={<Programme />} />
                        <Route path="/realisations" element={<Realisation />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;