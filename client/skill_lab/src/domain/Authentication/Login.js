import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { auth, db } from "../../firebase";
import { useDispatch } from "react-redux";
import {
  login,
  storeGroups,
  storeMentors,
} from "../../store/reducers/userSlice";
import { useHistory } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  logo_size: {
    width: "50%",
    height: "50%",
  },
}));
export async function getUserSubspaces(uid) {
  var userSubspaces = [];

  await db
    .collection("userSubspace")
    .where("user_id", "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        var subspace = {
          id: doc.data().subspace_id,
          name: doc.data().subspace_name,
          imageURL: doc.data().imageURL,
        };
        console.log("Subspace name: " + doc.data().subspace_name);
        userSubspaces.push(subspace);
      });
    });
  console.log("User subspaces list: " + userSubspaces);
  return userSubspaces;
}

export async function getMentorList(uid) {
  var mentorList = [];

  await db
    .collection("mentorRelation")
    .where("mentee_id", "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        var mentor = {
          id: doc.data().mentor_id,
          name: doc.data().mentor_name,
        };
        mentorList.push(mentor);
      });
    });
  return mentorList;
}

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  var uid = "";
  //Use firebase to log user into app
  const loginToApp = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((userAuth) => {
        dispatch(
          login({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
          })
        );
        uid = userAuth.user.uid;
      })
      .then(() => {
        getUserSubspaces(uid).then((data) => {
          console.log("Data from LS " + data[0]);
          //Store groups to redux
          dispatch(
            storeGroups({
              groups: data,
            })
          );
        });
      })
      .then(() => {
        getMentorList(uid).then((data) => {
          dispatch(
            storeMentors({
              mentors: data,
            })
          );
        });
      })
      .then(() => {
        history.push("/home");
      })

      .catch((error) => alert(error));
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar
          alt="Remy Sharp"
          src="Skill_Lab_Logo.png"
          className={classes.logo_size}
        />
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={loginToApp}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
