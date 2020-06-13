import React, { useState } from "react";
import Fire from "./Fire";
import { CREATE_USER_MUTATION } from "../graphql/mutations";
import { Mutation } from "react-apollo";
import Loading from ".././components/Loading";
import LoaderSmall from '../components/LoaderSmall';

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showlogin, setShowlogin] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSaveUserToLocalStorage = (email:any) => {
    localStorage.setItem('enye_app_email', email);
  };



  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true)
    console.log(email, password);
    Fire.auth()
      .signInWithEmailAndPassword(email, password)
      .then((user: any) => {
        console.log(user);
        handleSaveUserToLocalStorage(email)
        setLoading(false)
      })
      .catch((error: any) => {
        console.log(error.message);
        setError(true);
        setErrorMessage(`User with this email and password dosent exist...please register`);
        setLoading(false)
      });
  };

  const handleRegister = (e: any ,createUser: any) => {
    e.preventDefault();
    console.log(email, password);
    Fire.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user: any) => {
        console.log(user);
        handleSaveUserToLocalStorage(email)
        createUser({ variables: { email: email } });
      })
      .catch((error: any) => {
        console.log(error.message);
        setError(true);
        setErrorMessage(`An error occoured please try again`);
      });
  };

  return (
    <div>
      <div
        className=""
        style={{
          marginTop: "200px",
          overflowX: "hidden",
          maxHeight: "100vh",
          minHeight: "0px",
        }}
      >
        <h2 className="text-center mt-4">{showlogin ? `Login` : `Register`}</h2>
        <div className="text-center justify-content-center">
        <img
              src="https://previews.123rf.com/images/putracetol/putracetol1706/putracetol170602110/80819423-medical-icon-logo-design-element.jpg"
              alt="..."
              width={65}
              className=" rounded-circle img-thumbnail shadow-sm btn-outline-primary "
            />
            </div>
        <br />
        <div className="row">
          <div className="col-md-4 offset-md-4">
          {loading && (
            <LoaderSmall/>
          )}
            {error && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

          </div>
        </div>

        <div className="row m-1">
          <Mutation mutation={CREATE_USER_MUTATION}>
            {(createUser: any, props: any) => {
              if (props.error) return <div className="">Error</div>;
              if (props.loading) return <Loading />;
              if (props.data) {
                console.log(`created sucessfully`);
              }
              return (
                <form
                  className="col-md-4 offset-md-4 card p-4"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      className="form-control"
                      id="exampleInputPassword1"
                    />
                  </div>

                  {showlogin ? (
                    <>
                      <button type="submit" className="btn btn-primary">
                        Login
                      </button>
                      <a
                        className=" text-primary "
                        onClick={() => setShowlogin(!showlogin)}
                      >
                        or Register
                      </a>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={e => handleRegister(e, createUser)}
                        type="submit"
                        className="btn btn-success"
                      >
                        Register
                      </button>
                      <a
                        className="  text-primary "
                        onClick={() => setShowlogin(!showlogin)}
                      >
                        or Login
                      </a>
                    </>
                  )}
                </form>
              );
            }}
          </Mutation>
        </div>
      </div>
    </div>
  );
};

export default Auth;
