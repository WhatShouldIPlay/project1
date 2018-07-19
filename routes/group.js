const express = require("express");
const groupRoutes = express.Router();
const Group = require("../models/Group");
const User = require("../models/User");
const Picture = require("../models/Picture");
const multer = require("multer");
const upload = require("../cloudinaryConfig/cloudinary.js");


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
            const newPic = new Picture({
              filename: req.file.originalname,
              path: req.file.url
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
      next();
    });
});

// Read group by Id

groupRoutes.get("/:id", (req, res, next) => {
  Group.findById(req.params.id)
    .populate("img")
    .populate("members")
    .then(group => {
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
groupRoutes.post("/:id/edit", upload.single("img"), (req, res, next) => {
  const id = req.params.id;
  let { name, location, members, newMembers } = req.body;
  const update = {
    name,
    location,
    members,
    newMembers
  };

  if (!name) delete update.name;
  if (!location) delete update.location;
  if (!newMembers) delete update.newMembers;

  if(members && req.file){
    members = req.body.members.split(", ");
    const newPic = new Picture({
      filename: req.file.originalname,
      path: req.file.url
    })
    update.img = newPic;
    Promise.all([
      User.find({ username: { $in: members } }),
      newPic.save()
    ])
      .then(result=>{
        console.log(result);
        const membersId = [];
        result[0].forEach(e => membersId.push(e._id));
        update.members = membersId;
        Group.findByIdAndUpdate(id, update)
        .then(() => {
          res.redirect("/user/profile");
          return
        })
        .catch(e => {
          console.log(e.message);
          next();
        });
      })
      .catch(e=>{
        console.log(e)
        next();
      })
  } else if(req.file){
    const newPic = new Picture({
      filename: req.file.originalname,
      path: req.file.url
    })
    update.img = newPic;
    newPic.save()
    .then(()=>{
      Group.findByIdAndUpdate(req.params.id, update)
        .then(() => {
          res.redirect("/user/profile");
          return
        })
        .catch(e => {
          console.log(e.message);
          next();
        });
    })
    .catch(e => {
      console.log(e.message);
      next();
    });
  } 
  if (!members) {
    delete update.members;
  } else {
    members = req.body.members.split(", ");

    User.find({ username: { $in: members } })
      .then(users => {
        const membersId = [];
        users.forEach(e => membersId.push(e._id));
        update.members = membersId;
        Group.findByIdAndUpdate(id, update, { new: true })
          .then(() => {
            res.redirect("/group/list");
            return;
          })
          .catch(err => {
            console.log(err);
            next();
          });
      })
      .catch(err => {
        console.log(err.message);
        next();
      });
  }
  Group.findByIdAndUpdate(id, update, { new: true })
    .then(() => {
      res.redirect("/group/list");
      return;
    })
    .catch(e => {
      console.log(e.message);
      next();
    });
});

module.exports = groupRoutes;
