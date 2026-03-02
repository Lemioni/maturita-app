import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ITPage from './pages/ITPage';
import CJPage from './pages/CJPage';
import ProgressPage from './pages/ProgressPage';
import SearchPage from './pages/SearchPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import BookDetailPage from './pages/BookDetailPage';
import ExamPracticePage from './pages/ExamPracticePage';
import ChatPage from './pages/ChatPage';
import PresentationsPage from './pages/PresentationsPage';
import AutoscrollPage from './pages/AutoscrollPage';
import DictionaryPage from './pages/DictionaryPage';

import AchievementsPage from './pages/AchievementsPage';
import SpacedRepetitionPage from './pages/SpacedRepetitionPage';
import BookComparatorPage from './pages/BookComparatorPage';

import SimulatorPage from './pages/SimulatorPage';
import SpeechPracticePage from './pages/SpeechPracticePage';
import BingoPage from './pages/BingoPage';

import { ExperimentalProvider } from './context/ExperimentalContext';
import { PodcastProvider } from './context/PodcastContext';
import { PiPProvider } from './context/PiPContext';

function App() {
  return (
    <ExperimentalProvider>
      <PodcastProvider>
        <PiPProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/it" element={<ITPage />} />
                <Route path="/it/question/:id" element={<QuestionDetailPage />} />
                <Route path="/cj" element={<CJPage />} />
                <Route path="/cj/book/:id" element={<BookDetailPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/exam-practice" element={<ExamPracticePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/presentations" element={<PresentationsPage />} />
                <Route path="/autoscroll" element={<AutoscrollPage />} />
                <Route path="/dictionary" element={<DictionaryPage />} />

                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/srs" element={<SpacedRepetitionPage />} />
                <Route path="/compare" element={<BookComparatorPage />} />

                <Route path="/simulator" element={<SimulatorPage />} />
                <Route path="/speech" element={<SpeechPracticePage />} />
                <Route path="/bingo" element={<BingoPage />} />
              </Routes>
            </Layout>
          </Router>
        </PiPProvider>
      </PodcastProvider>
    </ExperimentalProvider>
  );
}

export default App;
