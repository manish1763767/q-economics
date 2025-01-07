const UserProgress = require('../models/UserProgress');
const Test = require('../models/Test');
const PreviousYearPaper = require('../models/PreviousYearPaper');
const { Op } = require('sequelize');

class RecommendationEngine {
  static async getRecommendedTests(userId) {
    try {
      // Get user's progress data
      const userProgress = await UserProgress.findAll({
        where: { userId },
        attributes: ['subject', 'topic', 'strengthLevel', 'averageScore'],
      });

      // Identify weak areas
      const weakAreas = userProgress.filter(
        progress => progress.strengthLevel === 'Weak' || progress.strengthLevel === 'Improving'
      );

      // Get recommended tests based on weak areas
      const recommendations = [];
      for (const area of weakAreas) {
        const tests = await Test.findAll({
          where: {
            subject: area.subject,
            isActive: true,
            [Op.or]: [
              { tags: { [Op.contains]: [area.topic] } },
              { difficulty: area.averageScore < 40 ? 'Easy' : 'Medium' },
            ],
          },
          limit: 3,
        });
        recommendations.push(...tests);
      }

      // Get practice tests for strong areas
      const strongAreas = userProgress.filter(
        progress => progress.strengthLevel === 'Good' || progress.strengthLevel === 'Excellent'
      );

      for (const area of strongAreas) {
        const tests = await Test.findAll({
          where: {
            subject: area.subject,
            isActive: true,
            difficulty: 'Hard',
            tags: { [Op.contains]: [area.topic] },
          },
          limit: 2,
        });
        recommendations.push(...tests);
      }

      // Get relevant previous year papers
      const papers = await PreviousYearPaper.findAll({
        where: {
          subject: { [Op.in]: userProgress.map(p => p.subject) },
          isActive: true,
        },
        limit: 5,
        order: [['year', 'DESC']],
      });

      return {
        recommendedTests: recommendations,
        previousYearPapers: papers,
        weakAreas,
        strongAreas,
      };
    } catch (error) {
      console.error('Error in recommendation engine:', error);
      throw error;
    }
  }

  static async getPersonalizedLearningPath(userId) {
    try {
      const userProgress = await UserProgress.findAll({
        where: { userId },
        order: [['averageScore', 'ASC']],
      });

      const learningPath = [];
      
      // Build learning path based on progress
      for (const progress of userProgress) {
        const nextSteps = [];

        if (progress.averageScore < 40) {
          nextSteps.push({
            type: 'Practice',
            difficulty: 'Easy',
            focus: 'Fundamentals',
            recommended: await this.getRecommendedResourcesByTopic(progress.subject, progress.topic, 'Easy'),
          });
        } else if (progress.averageScore < 60) {
          nextSteps.push({
            type: 'Practice',
            difficulty: 'Medium',
            focus: 'Concept Building',
            recommended: await this.getRecommendedResourcesByTopic(progress.subject, progress.topic, 'Medium'),
          });
        } else if (progress.averageScore < 80) {
          nextSteps.push({
            type: 'Advanced',
            difficulty: 'Hard',
            focus: 'Problem Solving',
            recommended: await this.getRecommendedResourcesByTopic(progress.subject, progress.topic, 'Hard'),
          });
        } else {
          nextSteps.push({
            type: 'Mastery',
            difficulty: 'Hard',
            focus: 'Advanced Concepts',
            recommended: await this.getRecommendedResourcesByTopic(progress.subject, progress.topic, 'Hard'),
          });
        }

        learningPath.push({
          subject: progress.subject,
          topic: progress.topic,
          currentLevel: progress.strengthLevel,
          progress: progress.averageScore,
          nextSteps,
        });
      }

      return learningPath;
    } catch (error) {
      console.error('Error creating learning path:', error);
      throw error;
    }
  }

  static async getRecommendedResourcesByTopic(subject, topic, difficulty) {
    try {
      const [tests, papers] = await Promise.all([
        Test.findAll({
          where: {
            subject,
            difficulty,
            tags: { [Op.contains]: [topic] },
            isActive: true,
          },
          limit: 3,
        }),
        PreviousYearPaper.findAll({
          where: {
            subject,
            difficulty,
            tags: { [Op.contains]: [topic] },
            isActive: true,
          },
          limit: 2,
        }),
      ]);

      return { tests, papers };
    } catch (error) {
      console.error('Error getting recommended resources:', error);
      throw error;
    }
  }
}

module.exports = RecommendationEngine;
