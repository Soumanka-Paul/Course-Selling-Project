import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,  // FIXED: Use Schema.Types
        ref: "Admin"  // FIXED: Changed from "User" to "Admin"
    },
}, {
    timestamps: true  // Adds createdAt and updatedAt automatically
});

export const Course = mongoose.model("Course", courseSchema);