import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ITPage from './pages/ITPage';
import CJPage from './pages/CJPage';
import FlashcardsPage from './pages/FlashcardsPage';
import ProgressPage from './pages/ProgressPage';
import SearchPage from './pages/SearchPage';
import QuestionDetailPage from './pages/QuestionDetailPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/it" element={<ITPage />} />
          <Route path="/it/question/:id" element={<QuestionDetailPage />} />
          <Route path="/cj" element={<CJPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
