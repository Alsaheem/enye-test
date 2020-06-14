import React, { useContext } from "react";
import Fire from "../containers/Fire";
import { AuthContext } from "../App";
import { useHistory } from "react-router-dom";

const Navbar = (props: any) => {
  const isAuthenticated = useContext(AuthContext);
  console.log(isAuthenticated);
  const history = useHistory();

  const handleGetUserFromLocalStorage = () => {
    return localStorage.getItem("enye_app_email");
  };

  const handleRemoveUserFromLocalStorage = () => {
    return localStorage.removeItem("enye_app_email");
  };

  const handleLogout = () => {
    console.log(`logging out...`);
    handleRemoveUserFromLocalStorage();
    history.push("/");
    Fire.auth().signOut();
  };

  return (
    <>
      <div className="vertical-nav bg-white" id="sidebar">
        <div className=" px-3 mb-4 bg-light">
          <div className="media d-flex align-items-center">
            <img
              src="https://previews.123rf.com/images/putracetol/putracetol1706/putracetol170602110/80819423-medical-icon-logo-design-element.jpg"
              alt="..."
              width={65}
              className="mr-3 rounded-circle img-thumbnail shadow-sm btn-outline-primary"
            />
            <div className="media-body">
              <h4 className="m-0">Med-Locator</h4>
            </div>
          </div>
        </div>
        <p className="font-weight-bold  mb-0 badge badge-info btn-block py-3 ">
          Welcome : {handleGetUserFromLocalStorage()}
        </p>
        <br />
        <br />
        <div className="">
          <button
            type="submit"
            onClick={handleLogout}
            className="btn btn-block btn-outline-danger btn-sm text-center justify-content-center"
          >
            Signout
          </button>
        </div>
        <br />
        <h5 className="text-dark  text-uppercase px-3  pb-4 mb-0">
          My History...
        </h5>
        <ul
          className="list-group"
          style={{ overflowY: "scroll", maxHeight: "800px" }}
        >
          {props.children}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
