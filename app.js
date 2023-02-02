require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");

const User = require("./model/User");
const SellingItems = require("./model/Cake");
const Orders = require("./model/Order");

var LocalStrategy = require("passport-local").Strategy;

const session = require("express-session");
const MongoStore = require("connect-mongo");


const app = express();

// Connect to MongoDB
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
  }
);

let store = new MongoStore({
  mongoUrl: process.env.MONGO_URI,
  collection: "sessions",
});

// Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
  })
);

app.set("view engine", "ejs");

//Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, cb) {
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return cb(null, false);
          }
          const isValid = validPassword(password, user.hash, user.salt);

          if (isValid) {
            return cb(null, user);
          } else {
            return cb(null, false);
          }
        })
        .catch((err) => {
          cb(err);
        });
    }
  )
);
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});
passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.get("/", function (req, res) {
  SellingItems.find({}, function (err, foundItems) {
    if (!err) {
      if (req.isAuthenticated()) {
        res.render("home", {
          itemList: foundItems,
          login: true,
          name: req.user.name,
        });
      } else {
        res.render("home", { itemList: foundItems, login: false });
      }
    }
  });
});

app.get("/login",checkNotAuthentication, function (req, res) {
  res.render("login", { login: false });
});

app.get("/destroy", function (req, res) {
  req.session.destroy(function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      console.log(err);
      res.redirect("/");
    }
  });
});

app.get("/logout", (req, res, next) => {
  req.logout(() => {
    res.redirect("/destroy");
  });
});

app.get("/success", function (req, res) {
  res.send(`<div style="text-align:center;margin:250px;"><h1>YOUR ORDER WAS SUCCESSFULLY PLACED!</h1><br><a href="/">Click Here</a></div>`);
});

app.get("/error", function (req, res) {
  res.send("An Error Occured!");
});

app.get("/register",checkNotAuthentication, function (req, res) {
  res.render("register", { login: false, name: "null" });
});

app.get("/checkout", checkAuthentication, (req, res, next) => {
  const Orders = req.session.orders || [];
  const sum = req.session.sum;
  
  res.render("checkout", { finalOrders : Orders, totSum : sum, login: true, name: req.user.name });
  
});

app.get("/cart", checkAuthentication, function (req, res) {

  Orders.find({ user: req.user._id })
    .populate('user')
    .populate('order')
    .exec((err, orders) => {
        if (err) {
          console.log("ERROR /cart :\n" + err);
          res.redirect("/");
        } else {

          const OrderList = [];

          orders.forEach((order) => {
            const obj = {
              order: order.order,
              id: order._id
            }
            
            OrderList.push(obj);
          });

          var sum=0
          OrderList.forEach(function(item){ 
            sum += item.order.price 
          });


          req.session.sum = sum;
          req.session.orders = OrderList;

            res.render("cart", {  itemList: OrderList, login: true, name: req.user.name });
            // res.render("cart", {  itemList: OrderList, login: false, name: "abc" });
        }
    });
});

app.post("/addToCart", function (req, res) {

  Orders.create({
    user: req.user._id,
    order: req.body.OrderID,
    date: new Date()
}, (err, order) => {
    if (err) {
        console.log(err);
    } else {
        res.redirect("/#menu");
    }
});
});

app.post("/deleteItem", function (req, res) {
  const ID = req.body.itemID;
  // console.log(ID);
   Orders.findByIdAndDelete(ID, function (err) {
    if (!err) {
      // console.log("Successfully deleted checked item.");
      res.redirect("/cart");
    }
  });

});

app.post( "/login",
  passport.authenticate("local", {
    failureRedirect: "/error",
    successRedirect: "/",
  }),
  (err, req, res, next) => {
    if (err) next(err);
  }
);

app.post("/register", async function (req, res) {
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    hash: hash,
    salt: salt,
  });

  user.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("/error");
    } else {
      console.log(user);
      res.redirect("/login");
    }
  });
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}
