import React from "react";

import './styles.scss';

export const Navbar: React.FC = () => (
  <nav>
    <div className="nav-wrapper blue darken-1 px1">
      <a href="/" className="brand-logo">Test GraphQL + React + Typescript</a>
      <ul className="right hide-on-med-and-down">
        <li >
          <a href="/" className="navbar-item">
            <i className="material-icons px1">
              text_snippet
            </i>
            Repository
          </a>
        </li>
      </ul>
    </div>
  </nav>
);