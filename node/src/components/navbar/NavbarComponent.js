import React from 'react'
import {
    Link
  } from "react-router-dom";
import '../../styles/Navbar.css'

const NavbarComponent = () => {
    return (
        <nav className = 'navbar'>
            <div className = 'mainLogo'>Metrics</div>
            <Link className = 'navbarLink' to = "/">Главная</Link>
            <Link className = 'navbarLink' to = "/employee">Сотрудники</Link>
            <Link className = 'navbarLink' to = "/project">Проекты</Link>
        </nav>
    )
}

export default NavbarComponent
