const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const handlebars = require('handlebars');

// Validate environment variables
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error('Missing required SMTP configuration');
}

// Create reusable transporter with validated config
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Load email template
async function loadTemplate(templateName) {
  const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.hbs`);
  const template = await fs.readFile(templatePath, 'utf-8');
  return handlebars.compile(template);
}

// Send email with template
async function sendNotificationEmail({ to, subject, template, data }) {
  try {
    const compiledTemplate = await loadTemplate(template);
    const html = compiledTemplate(data);

    await transporter.sendMail({
      from: `"Q-Economics" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Email templates for different notifications
const emailTemplates = {
  welcome: async (user) => ({
    subject: 'Welcome to Q-Economics',
    template: 'welcome',
    data: {
      name: user.firstName,
      loginUrl: `${process.env.FRONTEND_URL}/login`,
    },
  }),

  testResult: async (user, test, result) => ({
    subject: `Your Results: ${test.title}`,
    template: 'testResult',
    data: {
      name: user.firstName,
      testTitle: test.title,
      score: result.score,
      percentage: result.percentage,
      resultUrl: `${process.env.FRONTEND_URL}/results/${result.id}`,
    },
  }),

  passwordReset: async (user, resetToken) => ({
    subject: 'Password Reset Request',
    template: 'passwordReset',
    data: {
      name: user.firstName,
      resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
    },
  }),

  newForumPost: async (user, post) => ({
    subject: 'New Forum Post',
    template: 'newForumPost',
    data: {
      name: user.firstName,
      postTitle: post.title,
      posterName: `${post.User.firstName} ${post.User.lastName}`,
      postUrl: `${process.env.FRONTEND_URL}/forum/posts/${post.id}`,
    },
  }),
};

module.exports = {
  sendNotificationEmail,
  emailTemplates,
};
