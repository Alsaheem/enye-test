import React from "react";

const Navbar = () => {
  return (
    <>
      <nav className=" navbar-expand-lg navbar navbar-dark bg-primary p-3 fixed">
        <a className="navbar-brand" href="/">
        <img src="https://previews.123rf.com/images/putracetol/putracetol1706/putracetol170602110/80819423-medical-icon-logo-design-element.jpg" className="mr-2" alt="LoGo"  height="50px" />
          Hospital-Locator
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <a
                className="nav-link"
                href="#"
              >
                History <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item active">
              <a
                className="nav-link"
                href="https://github.com/Alsaheem"
                target="_blank"
              >
                Github <span className="sr-only">(current)</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};


export default Navbar
