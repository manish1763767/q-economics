const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Test title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Test description is required'],
    },
    category: {
      type: String,
      required: [true, 'Test category is required'],
      enum: ['Microeconomics', 'Macroeconomics', 'Statistics', 'Economic History'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Test duration is required'],
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
    },
    passingMarks: {
      type: Number,
      required: [true, 'Passing marks is required'],
    },
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    }],
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    instructions: {
      type: String,
      required: [true, 'Test instructions are required'],
    },
    tags: [{
      type: String,
      trim: true,
    }],
    attempts: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
testSchema.index({ category: 1, difficulty: 1 });
testSchema.index({ title: 'text', description: 'text' });

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
