const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
})
.catch((error) => {
    console.log("MongoDB connection error:", error.message);
});


// ==================== MEMBER SCHEMA ====================

const memberSchema = new mongoose.Schema({
    memberId: String,
    name: String,
    clubName: String,
    year: Number,
    role: String,
    points: Number,
    interests: String,
    status: String
});

const Member = mongoose.model("Member", memberSchema);


// ==================== BUDDY SCHEMA ====================

const buddySchema = new mongoose.Schema({
    buddyId: String,
    name: String,
    destination: String,
    age: Number,
    budget: Number,
    tripDuration: Number,
    interests: String,
    status: String
});

const Buddy = mongoose.model("Buddy", buddySchema);


// ==================== HOME PAGE ====================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// ==================================================
//             PROBLEM 1 - CLUB MEMBERS
// ==================================================


// 4. Add Member
app.post("/members", async (req, res) => {

    try {

        const member = new Member({
            memberId: req.body.memberId,
            name: req.body.name,
            clubName: req.body.clubName,
            year: req.body.year,
            role: req.body.role,
            points: req.body.points,
            interests: req.body.interests,
            status: req.body.status
        });

        await member.save();

        res.send("Club member added successfully");

    } catch (error) {

        console.log(error);
        res.status(500).send("Error adding member");

    }

});


// 5. Members of a club with points greater than given value
app.get("/member-search", async (req, res) => {

    const members = await Member.find({
        clubName: req.query.clubName,
        points: { $gt: Number(req.query.points) }
    }).select("name clubName role points -_id");

    res.json(members);

});


// 6. Search member using Member ID
app.get("/member/:id", async (req, res) => {

    const member = await Member.findOne({
        memberId: req.params.id
    }).select("name clubName role points -_id");

    res.json(member);

});


// 7. Display selected member details
app.get("/members", async (req, res) => {

    const members = await Member.find()
        .select("name clubName role points -_id");

    res.json(members);

});


// 8. Update role and points
app.put("/member-update/:id", async (req, res) => {

    await Member.updateOne(
        { memberId: req.params.id },
        {
            role: req.body.role,
            points: req.body.points
        }
    );

    res.send("Member updated successfully");

});


// 9. Increase points of all members of a club
app.put("/increase-points", async (req, res) => {

    await Member.updateMany(
        { clubName: req.body.clubName },
        {
            $inc: {
                points: Number(req.body.points)
            }
        }
    );

    res.send("Points increased successfully");

});


// 10. Search members within points range
app.get("/points-range", async (req, res) => {

    const members = await Member.find({
        points: {
            $gte: Number(req.query.min),
            $lte: Number(req.query.max)
        }
    }).select("name clubName role points -_id");

    res.json(members);

});


// 11. Delete member
app.delete("/member-delete/:id", async (req, res) => {

    await Member.deleteOne({
        memberId: req.params.id
    });

    res.send("Member deleted successfully");

});


// 12. Display all members in descending order of points
app.get("/members-sort", async (req, res) => {

    const members = await Member.find()
        .select("name clubName role points -_id")
        .sort({ points: -1 });

    res.json(members);

});


// ==================================================
//             PROBLEM 2 - TRAVEL BUDDY
// ==================================================


// 4. Add Travel Buddy
app.post("/buddies", async (req, res) => {

    try {

        const buddy = new Buddy({
            buddyId: req.body.buddyId,
            name: req.body.name,
            destination: req.body.destination,
            age: req.body.age,
            budget: req.body.budget,
            tripDuration: req.body.tripDuration,
            interests: req.body.interests,
            status: req.body.status
        });

        await buddy.save();

        res.send("Travel Buddy added successfully");

    } catch (error) {

        console.log(error);
        res.status(500).send("Error adding buddy");

    }

});


// 5. Destination and budget greater than given amount
app.get("/buddy-search", async (req, res) => {

    const buddies = await Buddy.find({
        destination: req.query.destination,
        budget: { $gt: Number(req.query.budget) }
    }).select("name destination budget tripDuration -_id");

    res.json(buddies);

});


// 6. Search Buddy using Buddy ID
app.get("/buddy/:id", async (req, res) => {

    const buddy = await Buddy.findOne({
        buddyId: req.params.id
    }).select("name destination budget tripDuration -_id");

    res.json(buddy);

});


// 7. Display required details
app.get("/buddies", async (req, res) => {

    const buddies = await Buddy.find()
        .select("name destination budget tripDuration -_id");

    res.json(buddies);

});


// 8. Update destination and budget
app.put("/buddy-update/:id", async (req, res) => {

    await Buddy.updateOne(
        { buddyId: req.params.id },
        {
            destination: req.body.destination,
            budget: req.body.budget
        }
    );

    res.send("Travel Buddy updated successfully");

});


// 9. Increase budget for a destination
app.put("/increase-budget", async (req, res) => {

    await Buddy.updateMany(
        { destination: req.body.destination },
        {
            $inc: {
                budget: Number(req.body.amount)
            }
        }
    );

    res.send("Budget increased successfully");

});


// 10. Search buddies within budget range
app.get("/budget-range", async (req, res) => {

    const buddies = await Buddy.find({
        budget: {
            $gte: Number(req.query.min),
            $lte: Number(req.query.max)
        }
    }).select("name destination budget tripDuration -_id");

    res.json(buddies);

});


// 11. Delete Buddy
app.delete("/buddy-delete/:id", async (req, res) => {

    await Buddy.deleteOne({
        buddyId: req.params.id
    });

    res.send("Travel Buddy deleted successfully");

});


// 12. Display all buddies in descending order of budget
app.get("/buddies-sort", async (req, res) => {

    const buddies = await Buddy.find()
        .select("name destination budget tripDuration -_id")
        .sort({ budget: -1 });

    res.json(buddies);

});