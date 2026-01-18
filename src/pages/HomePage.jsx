import MaturityCountdown from '../components/dashboard/MaturityCountdown';
import QuestionGrid from '../components/dashboard/QuestionGrid';

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-terminal-border/20 pb-4">
         <h1 className="text-2xl font-bold text-terminal-accent tracking-wider">
          &gt; DASHBOARD
        </h1>
      </div>

      {/* Countdown */}
      <MaturityCountdown />

      {/* Question Grid */}
      <div>
        <h2 className="text-sm text-terminal-text/60 mb-3 tracking-wider">
          &gt; OTÁZKY
        </h2>
        <QuestionGrid />
      </div>
    </div>
  );
};

export default HomePage;
