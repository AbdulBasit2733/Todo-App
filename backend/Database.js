const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  name: String,
});

const TodoSchema = new Schema({
  title: String,
  done: Boolean,
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Ensure this matches your User model
});


const UserModel = mongoose.model("users", UserSchema);
const TodoModel = mongoose.model("todos", TodoSchema);

module.exports = {
  UserModel,
  TodoModel,
};
