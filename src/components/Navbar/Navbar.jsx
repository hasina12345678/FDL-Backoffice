import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import fdl_logo from "../../assets/img/logo/logo_fdl.png";
import LogoutButton from "../Logout/LogoutButton";

import "./Navbar.css";

function Navbar() {
    const [openMenus, setOpenMenus] = useState({
        actualites: true,
        realisations: true,
    });

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    return (
        <nav className="navbar">
            <div className="navbar__logo">
                <NavLink to="/accueil" className="navbar__logo-link">
                    <img src={fdl_logo} alt="FDL" className="navbar__logo-img navbar__logo-fdl"/>
                </NavLink>
            </div>

            <ul className="navbar__menu">
                {/* <li className="navbar__item">
                    <NavLink to="/accueil">Accueil</NavLink>
                </li> */}

                {/* ACTUALITES */}
                <li className={`navbar__item dropdown ${openMenus.actualites ? "open" : ""}`}>
                    <button
                        className="navbar__link"
                        onClick={() => toggleMenu("actualites")}
                        aria-expanded={openMenus.actualites}
                    >
                        Actualités
                    </button>
                    {openMenus.actualites && (
                        <ul className="dropdown__menu">
                            <li><NavLink to="/auteurs">Auteur</NavLink></li>
                            <li><NavLink to="/categories-actualites">Catégorie</NavLink></li>
                            <li><NavLink to="/actualites">Actualités</NavLink></li>
                        </ul>
                    )}
                </li>

                {/* REALISATIONS */}
                <li className={`navbar__item dropdown ${openMenus.realisations ? "open" : ""}`}>
                    <button
                        className="navbar__link"
                        onClick={() => toggleMenu("realisations")}
                        aria-expanded={openMenus.realisations}
                    >
                        Réalisations
                    </button>
                    {openMenus.realisations && (
                        <ul className="dropdown__menu">
                            <li><NavLink to="/regions">Région</NavLink></li>
                            <li><NavLink to="/districts">District</NavLink></li>
                            <li><NavLink to="/communes">Commune</NavLink></li>
                            <li><NavLink to="/categories-realisations">Catégorie</NavLink></li>
                            <li><NavLink to="/sources-financement">Source Financement</NavLink></li>
                            <li><NavLink to="/programmes">Programme</NavLink></li>
                            <li><NavLink to="/realisations">Réalisations</NavLink></li>
                        </ul>
                    )}
                </li>
            </ul>

            <div className="navbar__footer">
                <LogoutButton />
            </div>
        </nav>
    );
}

export default Navbar;