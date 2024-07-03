
// Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Button, Typography, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination,
  Grid, Tooltip
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PrimarySearchAppBar from "../components/Navbar";
import { getUsers, createUser, updateUser, deleteUser } from "../redux/adminSlice";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

function Dashboard() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [editData, setEditData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleDialogOpen = (data = null) => {
    if (data) {
      setEditData(data);
    } else {
      setEditData(null);
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditData(null);
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (editData) {
      dispatch(updateUser({ id: editData._id, ...values }));
    } else {
      dispatch(createUser(values));
    }
    handleDialogClose();
    resetForm();
  };

  const handleUpdate = (user) => {
    handleDialogOpen(user);
  };

  const handleDelete = (id) => {
    setUserId(id);
    setDeleteDialogOpen(true);
  };

  const deleteUserById = () => {
    dispatch(deleteUser(userId));
    setDeleteDialogOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchInput.toLowerCase()) ||
    user.email.toLowerCase().includes(searchInput.toLowerCase())
  );

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <>
      <PrimarySearchAppBar />
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <Formik
          initialValues={{
            firstName: editData ? editData.firstName : '',
            lastName: editData ? editData.lastName : '',
            email: editData ? editData.email : '',
            password: editData ? editData.password : '',
            role: editData ? editData.role : '',
          }}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
            role: Yup.string().required('Role is required'),
          })}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form>
              <DialogTitle>{editData ? 'Update User' : 'Create User'}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {editData ? '' : 'To create a new user, please enter the details below.'}
                </DialogContentText>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  fullWidth
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
                <TextField
                  required
                  margin="dense"
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
                <TextField
                  required
                  margin="dense"
                  id="email"
                  name="email"
                  label="Email Address"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  required
                  margin="dense"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
                <TextField
                  required
                  margin="dense"
                  id="role"
                  name="role"
                  label="Role"
                  fullWidth
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                  helperText={formik.touched.role && formik.errors.role}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button type="submit" color="primary">
                  {editData ? 'Update' : 'Create'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteUserById} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={6}>
          <Typography variant="h5">User Management</Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
            Add User
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user, index) => (
                  <TableRow key={user._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <ModeEditIcon onClick={() => handleUpdate(user)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <DeleteIcon onClick={() => handleDelete(user._id)} style={{ cursor: 'pointer', color: 'red' }} />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredUsers.length === 0 && (
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
              <InfoIcon color="primary" fontSize="large" />
              <Typography variant="h6" color="primary">No us
                ers found</Typography>
            </Grid>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage(e)}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
