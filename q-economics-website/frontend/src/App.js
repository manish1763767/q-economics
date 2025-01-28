import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ForgotPassword from './components/ForgotPassword';
import Tests from './components/Tests';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import AdminDashboard from './components/AdminDashboard';
import ManageUsers from './components/ManageUsers';
import ManageTests from './components/ManageTests';
import TestTaking from './components/TestTaking';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import PreviousYearPapers from './components/PreviousYearPapers';
import DiscussionForums from './components/DiscussionForums';
import HelpCenter from './components/HelpCenter';
import Testimonials from './components/Testimonials';
import Gamification from './components/Gamification';
import CalendarSync from './components/CalendarSync';
import AIRecommendations from './components/AIRecommendations';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/tests" component={Tests} />
        <Route path="/contact" component={Contact} />
        <Route path="/faq" component={FAQ} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/admin" exact component={AdminDashboard} />
        <Route path="/admin/users" component={ManageUsers} />
        <Route path="/admin/tests" component={ManageTests} />
        <Route path="/test-taking/:id" component={TestTaking} />
        <Route path="/performance-analytics" component={PerformanceAnalytics} />
        <Route path="/previous-year-papers" component={PreviousYearPapers} />
        <Route path="/discussion-forums" component={DiscussionForums} />
        <Route path="/help-center" component={HelpCenter} />
        <Route path="/testimonials" component={Testimonials} />
        <Route path="/gamification" component={Gamification} />
        <Route path="/calendar-sync" component={CalendarSync} />
        <Route path="/ai-recommendations" component={AIRecommendations} />
      </Switch>
    </Router>
  );
};

export default App;
