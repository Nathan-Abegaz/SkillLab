import { Divider, Drawer, makeStyles, Toolbar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase";
import {
  addGroups,
  selectGroups,
  selectUser,
} from "../store/reducers/userSlice";
import Groups from "./Groups";
import Mentors from "./Mentors";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
}));

async function getUserSubspaces(user) {
  const userSubspaces = [];

  await db
    .collection("userSubspace")
    .where("user_id", "==", user.uid)
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

export default function LeftSidebar() {
  const classes = useStyles();

  //Retrieve user from redux
  const user = useSelector(selectUser);
  const subspaces = useSelector(selectGroups);
  console.log("Subspaces from REDUX: " + subspaces.groups);
  const dispatch = useDispatch();

  //Create state for data being retrieved from db
  const [groups, setGroups] = useState([]);
  const [mentors, setMentors] = useState([]);

  //Call useEffect to run when componenet mounted for Mentors
  useEffect(() => {
    //Retrieving a specific user data from the collection called "users"
    //Using their user.uid to select specific user
    var mentorList = [];
    db.collection("mentorRelation")
      .where("mentee_id", "==", "users/" + user.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var mentor = {
            id: doc.data().mentor_id,
            name: doc.data().mentor_name,
          };
          //setMentors([...mentors, {...mentor}])
          mentorList.push(mentor);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    setMentors(mentorList);
  }, [user]);

  //Call useEffect to run when componenet mounted for Groups
  useEffect(() => {
    getUserSubspaces(user).then((data) => {
      console.log("Data from LS " + data[0]);
      setGroups(data);
      dispatch(
        addGroups({
          groups: data,
        })
      );
    });
  }, [user]);

  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <Divider />
        <div className={classes.drawerContainer}>
          <Groups name="Groups" />

          <Divider />
          <Mentors name="Mentors" list={mentors} />
        </div>
      </Drawer>
    </div>
  );
}
