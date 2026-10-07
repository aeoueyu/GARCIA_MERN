const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Student = require('./models/Student');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('MongoDB connection error: ', error);
    });

// let students = [
//     {
//         id: 1,
//         name: 'Aeiou Nicole',
//         course: 'BSIT',
//         age: 21
//     }
// ];

app.get('/', (req, res) => {
    res.send('Server is running!');
});

// app.get('/students', (req, res) => {
//     res.json(students);
// });

app.get('/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.post('/students', async (req, res) => {
    try {
        const { name, course, age } = req.body;

        const newStudent = new Student({
            name,
            course,
            age
        });

        const savedStudent = await newStudent.save();

        res.status(201).json({
            message: 'Student created successfully',
            student: savedStudent
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Unable to create student'
        });
    }
});

// app.delete('/students:id', async (req, res) => {
//     try {
//         const deletedStudent = await Student.findByIdAndDelete(
//             req.params.id
//         );

//         if (!deletedStudent) {
//             return res.status(400).json({
//                 message: 'Student not found'
//             });
//         }

//         res.json({
//             message: 'Student deleted successfully'
//         });
//     }
//     catch (error) {
//         res.status(400).json({
//             message: 'Unable to delete student'
//         });
//     }
// });

app.delete('/students/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!deletedStudent) {
            return res.status(404).json({
                message: 'Student not found'
            })
        }

        res.json({
            message: 'Student deleted successfully'
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Unable to delete student'
        });
    }
});

app.put('/students/:id', async (req, res) => {
    try {
        const { name, course, age } = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { name, course, age },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: 'Student not found'
            })
        }

        res.json({
            message: 'Student updated successfully',
            student: updatedStudent
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'Unable to update student'
        })
    }
})

app.listen(5000, () => {
    console.log('Server running on port 5000');
});