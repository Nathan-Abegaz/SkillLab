import Login from "../../domain/Authentication/Login";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import SignUp from "../../domain/Authentication/SignUp.js";
import WelcomePage from "../../domain/WelcomePage";
import { useEffect } from "react";
import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "../../store/reducers/userSlice";
import Homepage from "../../domain/Homepage";
import Navbar from "../Navbar";
import InterestPage from "../../domain/InterestsPage";
import UserProfile from "../../domain/UserProfile";
import Subspace from "../../domain/Subspace";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        // user is logged iin
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
            displayName: userAuth.displayName,
          })
        );
      } else {
        //user is logged out
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return (
    <div className="App">
      <Navbar />
      <Router>
        {!user ? (
          <Switch>
            {/* Available routes for users that are not signed in */}
            <Route exact path="/" component={WelcomePage} />
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={Login} />
            {/* Routes not specified go to root */}
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        ) : (
          <Switch>
            {/* Available routes for users that are signed in */}
            <Route exact path="/" component={WelcomePage} />
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route path="/home" component={Homepage} />
            <Route path="/interestPage" component={InterestPage} />
            <Route path="/subspace/:subspaceName" component={Subspace} />
            <Route path="/userProfile/:user_id" component={UserProfile} />
          </Switch>
        )}
      </Router>
    </div>
  );
}

export default App;
