const express = require("express");
const groupRoutes = express.Router();
const Group = require("../models/Group");
const User = require("../models/User");
const Picture = require("../models/Picture");
const multer = require("multer");
const upload = multer({ dest: "./public/uploads/" });
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Read All Groups
groupRoutes.get("/", (req, res, next) => {
  res.redirect("/group/list");
});

groupRoutes.get("/list", (req, res, next) => {
  Group.find({})
    .populate("img")
    .then(groups => {
      res.render("group/list", { groups });
    })
    .catch(err => {
      console.log(err.message);
      next();
    });
});

// Create group

groupRoutes.get("/new", (req, res, next) => {
  res.render("group/new");
});

groupRoutes.post("/new", upload.single("img"), (req, res, next) => {
  let { name, location, members, newMembers } = req.body;
  console.log(req.body);
  if (name === "" || location === "") {
    res.render("group/new", { message: "Indicate Name and location" });
    return;
  }

  Group.findOne({ name })
    .then(group => {
      if (group !== null) {
        res.render("group/new", { message: "The name already exists" });
        return;
      } else {
        members = req.body.members.split(", ");
        User.find({ username: { $in: members } })
          .then(users => {
            const membersId = [];
            users.forEach(e => membersId.push(e._id));
            console.log(req.file);
            const newPic = new Picture({
              filename: req.file.originalname,
              path: `/uploads/${req.file.filename}`
            });

            const newGroup = new Group({
              name,
              location,
              members: membersId,
              newMembers,
              img: newPic
            });

            newPic.save().then(() => {
              newGroup.save().then(() => {
                res.redirect("/group/list");
              });
            });
          })
          .catch(err => {
            console.log(err);
            res.render("group/list", { message: "Something went wrong" });
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

// Read group by Id

groupRoutes.get("/:id", (req, res, next) => {
  Group.findById(req.params.id)
    .populate("img")
    .populate("members")
    .then(group => {
      console.log(group);
      res.render("group/group", { group });
    })
    .catch(err => {
      console.log(err.message);
      next();
    });
});

// Delete a group

groupRoutes.post("/:id/delete", (req, res, next) => {
  Group.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/group/list");
    })
    .catch(err => {
      console.log(err.message);
      next();
    });
});

// GET page to update a group

groupRoutes.get("/:id/edit", (req, res, next) => {
  Group.findById(req.params.id)
    .then(group => {
      res.render("group/edit", { group });
    })
    .catch(err => {
      console.log(err.message);
      next();
    });
});

// POST to update a group
groupRoutes.post("/:id/edit", upload.single('img'), (req, res, next) => {
  let { name, location, members, newMembers } = req.body;
  console.log('REQUEST BODY', req.file);
  Group.findById(req.params.id)
    .then(group => {
      if (name == "") name = group.name;
      if (location == "") location = group.location;
      if (members == "") members = group.members;
      if (newMembers == "") newMembers = { newMembers: true };

      members = req.body.members.split(", ");
      User.find({ username: { $in: members } })
        .then(users => {
          const membersId = [];
          users.forEach(e => membersId.push(e._id));
          console.log(req.file);
          /*const newPic = new Picture({
            filename: req.file.originalname,
            path: `/uploads/${req.file.filename}`
          });**/
          Group.findByIdAndUpdate(req.params.id, {
            name,
            location,
            members: membersId,
            newMembers,
            //img: newPic
          })
            .then(group => {
              console.log(`Group ${group.name} succesfully updated`);
              res.redirect("/group/list");
            })
            .catch(err => {
              console.log(err.message);
              next();
            });
        })
        .catch(err => {
          console.log(err);
          res.render("group/list", { message: "Something went wrong" });
        });
    })
    .catch(e => {
      console.log(e.message);
      next();
    });
});

module.exports = groupRoutes;
