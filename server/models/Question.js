const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
  explanation: {
    type: String,
    trim: true,
  },
});

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Question type is required'],
      enum: ['multiple-choice', 'true-false', 'short-answer'],
    },
    category: {
      type: String,
      required: [true, 'Question category is required'],
      enum: ['Microeconomics', 'Macroeconomics', 'Statistics', 'Economic History'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required'],
      min: [0, 'Marks cannot be negative'],
    },
    options: [optionSchema],
    correctAnswer: {
      type: String,
      required: function() {
        return this.type === 'short-answer';
      },
    },
    explanation: {
      type: String,
      trim: true,
    },
    hint: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // URL to image if question has an image
    },
    tags: [{
      type: String,
      trim: true,
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ text: 'text' });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
