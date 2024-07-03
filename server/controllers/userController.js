// controllers/userController.js
import User from '../models/userModel.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({
      success: true,
      message: "Fetched all users",
      users,
  });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    const user = await User.create({ firstName, lastName, email, password, role });
    res.status(201).send({
      success: true,
      message: "New user created succesfully!",
      user,
  });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { firstName, lastName, email, role }, { new: true });
    res.status(200).send({
      success: true,
      message: "User Updated succesfully!",
      user,
  });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "User Deleted succesfully!",
  });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
