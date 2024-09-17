const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const z = require("zod");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "1fgdgdfgd1dfsda";
const { UserModel, TodoModel } = require("./Database");

const app = express();

//Middlewares

app.use(express.json());
app.use(cors());

// MongoDb Connect

mongoose
  .connect(
    "mongodb+srv://abdulbasitkhan2733:TWRCaGaL2MjKDR12@todo-app.jehsr.mongodb.net/todo-app"
  )
  .then(() => {
    console.log("Connected To The Database");
  })
  .catch((err) => {
    console.log(err);
  });

const authMiddleWare = (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log(token);

    const decodedData = jwt.verify(token, JWT_SECRET);
    if (decodedData) {
      console.log(decodedData);
      req.id = decodedData.id;
      next();
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

app.post("/api/todo-app/auth/register", async (req, res) => {
  const { email, password, name } = req.body;

  // Define the Zod schema
  const requestedUserBodyData = z.object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long." })
      .max(100, { message: "Name can't be longer than 100 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(3, { message: "Password must be at least 3 characters long." })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
  });

  // Validate using safeParse
  const validationResult = requestedUserBodyData.safeParse({
    email,
    name,
    password,
  });

  // Handle validation errors
  if (!validationResult.success) {
    const errMessage = validationResult.error.errors.map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: errMessage,
    });
  }

  try {
    const isUser = await UserModel.findOne({ email: email });
    if (isUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await UserModel.create({
      email,
      password: hashedPassword,
      name,
    });
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/todo-app/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const userSendedBody = z.object({
    email: z.string().email({ message: "Invalid email Address" }),
    password: z
      .string()
      .min(3, { message: "Password must be at least greater than 3" }),
  });

  const validationResult = userSendedBody.safeParse({ email, password });
  if (!validationResult.success) {
    const errMessage = validationResult.error.errors.map((err) => err.message);
    return res.json({
      success: false,
      message: errMessage,
    });
  }

  try {
    const isUser = await UserModel.findOne({ email: email });
    if (!isUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    bcrypt.compare(password, isUser.password, (err, result) => {
      if (!result) {
        return res.status(400).json({
          success: false,
          message: "Email or password is incorrect",
        });
      } else {
        const token = jwt.sign({ id: isUser._id }, JWT_SECRET);
        res.status(200).json({
          success: true,
          token: token,
          message: "Logged in successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/todo-app/home", authMiddleWare, async (req, res) => {
  try {
    const userId = req.id;
    if (!userId)
      return res.json({ success: false, message: "User is Not Authorized" });
    const user = await UserModel.findOne({ userId });
    const todos = await TodoModel.find({ userId }).exec(); // Ensure userId is being used correctly
    res.json({
      success: true,
      todos: todos,
      user: user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      error: "Failed to fetch todos",
    });
  }
});

app.post("/api/todo-app/addtodo", authMiddleWare, async (req, res) => {
  try {
    const userId = req.id; // Ensure req.id is set by your auth middleware
    const { title, done } = req.body;

    // Check if the title is empty
    if (!title || title.length <= 0) {
      return res.json({
        success: false,
        message: "Please enter a valid todo title",
      });
    }

    // Create a new Todo
    const todo = new TodoModel({
      userId,
      title,
      done,
    });

    // Save the todo in the database
    await todo.save();

    // Respond with success
    res.json({
      success: true,
      message: "Todo added successfully",
    });
  } catch (error) {
    // Handle errors
    res.json({
      success: false,
      message: error.message,
      error: "Failed to add todo",
    });
  }
});

app.post("/api/todo-app/deletetodo", authMiddleWare, async (req, res) => {
  try {
    const userId = req.id;
    const { id } = req.body;
    
    if (!userId || !id) {
      return res.json({
        success: false,
        message: "Invalid user ID or todo ID",
      });
    }

    const response = await TodoModel.deleteOne({
      _id: id,
    });

    if (response.deletedCount === 0) {
      return res.json({ success: false, message: "Todo Not Found or Not Deleted" });
    }

    res.json({
      success: true,
      message: "Todo Deleted Successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
