// models/purchase.model.js
import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    upiId: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending"
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
});

purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Purchase = mongoose.model("Purchase", purchaseSchema);