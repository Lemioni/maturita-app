import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ITPage from './pages/ITPage';
import CJPage from './pages/CJPage';
import ProgressPage from './pages/ProgressPage';
import SearchPage from './pages/SearchPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import BookDetailPage from './pages/BookDetailPage';

import { ExperimentalProvider } from './context/ExperimentalContext';

function App() {
  return (
    <ExperimentalProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/it" element={<ITPage />} />
            <Route path="/it/question/:id" element={<QuestionDetailPage />} />
            <Route path="/cj" element={<CJPage />} />
            <Route path="/cj/book/:id" element={<BookDetailPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </Layout>
      </Router>
    </ExperimentalProvider>
  );
}

export default App;
