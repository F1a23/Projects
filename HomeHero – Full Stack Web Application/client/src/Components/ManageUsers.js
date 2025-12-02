import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import ManageProfile from "./ManageProfile";
import { getUsers, deleteUser } from "../Features/ManageUserSlice";
import {
  Button,
  Col,
  Label,
  Container,
  Row,
  FormGroup,
  Input,
  Form,
  Table,
} from "reactstrap";
import * as ENV from "../config";
import { updateUserProfile } from "../Features/UserSlice";

const ManageUsers = () => {
  const user = useSelector((state) => state.users.user);

  const allUsers = useSelector((state) => state.manageUsers.allUsers);
  const picURL = ENV.SERVER_URL + "/uploads/";

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteUser(id));

    navigate("/ManageUsers");
  };

  const handleUpdate = (id) => {
    navigate("/manageprofile/" + id);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(getUsers());
    }
  }, [user]);
  return (
    <div>
      <br></br>
      <br></br>
      <h4 className="h1">Manage Users</h4>

      <table className="table">
        <thead>
          <tr>
            <th>Profile Picture</th>

            <th>Name</th>

            <th>Email</th>

            <th>User Type</th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr key={user.email}>
              <td>
                <img src={picURL + user.profilePic} className="userImage" />
              </td>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>{user.userType}</td>

              <td>
                <Button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this user?"
                      )
                    ) {
                      handleDelete(user._id);
                    }
                  }}
                  color="danger"
                  size="sm"
                >
                  Delete
                </Button>
                &nbsp;&nbsp;&nbsp;
                <button onClick={() => handleUpdate(user._id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
