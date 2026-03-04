import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';

// Retry wrapper for lazy imports — retries up to 3 times on network failure
const lazyRetry = (importFn) =>
  lazy(() =>
    importFn().catch(() =>
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
        importFn().catch(() =>
          new Promise((resolve) => setTimeout(resolve, 2000)).then(() => importFn())
        )
      )
    )
  );

// Lazy-loaded pages — each gets its own chunk
const HomePage = lazyRetry(() => import('./pages/HomePage'));
const ITPage = lazyRetry(() => import('./pages/ITPage'));
const CJPage = lazyRetry(() => import('./pages/CJPage'));
const SearchPage = lazyRetry(() => import('./pages/SearchPage'));
const QuestionDetailPage = lazyRetry(() => import('./pages/QuestionDetailPage'));
const BookDetailPage = lazyRetry(() => import('./pages/BookDetailPage'));
const ExamPracticePage = lazyRetry(() => import('./pages/ExamPracticePage'));
const AutoscrollPage = lazyRetry(() => import('./pages/AutoscrollPage'));
const DictionaryPage = lazyRetry(() => import('./pages/DictionaryPage'));
const SpeechPracticePage = lazyRetry(() => import('./pages/SpeechPracticePage'));
const StudySchedulerPage = lazyRetry(() => import('./pages/StudySchedulerPage'));
const NeumeleckyTextPage = lazyRetry(() => import('./pages/NeumeleckyTextPage'));
const LoginPage = lazyRetry(() => import('./pages/LoginPage'));

import NavigationOverlay from './components/common/NavigationOverlay';
import { ExperimentalProvider } from './context/ExperimentalContext';
import { PodcastProvider } from './context/PodcastContext';
import { PiPProvider } from './context/PiPContext';
import { StudySchedulerProvider } from './context/StudySchedulerContext';
import { AuthProvider } from './context/AuthContext';
import { SyncProvider } from './context/SyncContext';
import StudyReminderOverlay from './components/scheduler/StudyReminderOverlay';

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-terminal-text/40 text-sm tracking-wider animate-pulse">Načítání...</div>
  </div>
);

// Inner component that has access to useLocation (needs to be inside Router)
const AppRoutes = () => {
  const location = useLocation();
  return (
    <Layout>
      <NavigationOverlay />
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/it" element={<ITPage />} />
            <Route path="/it/question/:id" element={<QuestionDetailPage />} />
            <Route path="/cj" element={<CJPage />} />
            <Route path="/cj/book/:id" element={<BookDetailPage />} />
            <Route path="/exam-practice" element={<ExamPracticePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/autoscroll" element={<AutoscrollPage />} />
            <Route path="/dictionary" element={<DictionaryPage />} />
            <Route path="/speech" element={<SpeechPracticePage />} />
            <Route path="/scheduler" element={<StudySchedulerPage />} />
            <Route path="/neumelecky" element={<NeumeleckyTextPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <SyncProvider>
        <ExperimentalProvider>
          <PodcastProvider>
            <PiPProvider>
              <StudySchedulerProvider>
                <Router>
                  <AppRoutes />
                  <StudyReminderOverlay />
                </Router>
              </StudySchedulerProvider>
            </PiPProvider>
          </PodcastProvider>
        </ExperimentalProvider>
      </SyncProvider>
    </AuthProvider>
  );
}

export default App;
