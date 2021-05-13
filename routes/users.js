const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//UPDATE
router.put("/:id", async (req, res) => {
    if(req.body.userId == req.params.id || req.body.isAdmin) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch(err) {
                return res.status(500).json(err);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account updated");
        } catch(err) {
            return res.status(500).json(err);
        }

    } else {
        return res.status(403).json("You can update only your account");
    }
})


//DELETE
router.delete("/:id", async (req, res) => {
    if(req.body.userId == req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account deleted");
        } catch(err) {
            return res.status(500).json(err);
        }

    } else {
        return res.status(403).json("You can delete only your account");
    }
})


//GET
router.get("/:id", async (req, res) => {
    
    try {
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch(err) {
        return res.status(500).json(err);
    }
    

    
})


//FOLLOW
router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            //followed user
            const user = await User.findById(req.params.id);
            //following user
            const currentUser = await User.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: { followers: req.body.userId }
                });
                await currentUser.updateOne({
                    $push: { followings: req.params.id }
                });
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you already follow the user");
            }
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can't follow yourself");
    }
})

//UNFOLLOW

router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            //unfollowed user
            const user = await User.findById(req.params.id);
            //unfollowing user
            const currentUser = await User.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    // qurey
                    $pull: { followers: req.body.userId }
                });
                await currentUser.updateOne({
                    //query
                    $pull: { followings: req.params.id }
                });
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("you are not following the user");
            }
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can't unfollow yourself");
    }
})

module.exports = router;