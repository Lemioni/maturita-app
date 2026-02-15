import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ITPage from './pages/ITPage';
import CJPage from './pages/CJPage';
import ProgressPage from './pages/ProgressPage';
import SearchPage from './pages/SearchPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import BookDetailPage from './pages/BookDetailPage';
import DopaminePage from './pages/DopaminePage';
import ChatPage from './pages/ChatPage';
import PresentationsPage from './pages/PresentationsPage';

import { ExperimentalProvider } from './context/ExperimentalContext';
import { PodcastProvider } from './context/PodcastContext';

function App() {
  return (
    <ExperimentalProvider>
      <PodcastProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/it" element={<ITPage />} />
              <Route path="/it/question/:id" element={<QuestionDetailPage />} />
              <Route path="/cj" element={<CJPage />} />
              <Route path="/cj/book/:id" element={<BookDetailPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/dopamine" element={<DopaminePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/presentations" element={<PresentationsPage />} />
            </Routes>
          </Layout>
        </Router>
      </PodcastProvider>
    </ExperimentalProvider>
  );
}

export default App;
