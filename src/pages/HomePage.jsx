import QuestionGrid from '../components/dashboard/QuestionGrid';

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Question Grid */}
      <div>
        <h2 className="text-sm text-terminal-text/60 mb-3 tracking-wider">
          &gt; MATURITA
        </h2>
        <QuestionGrid />
      </div>
    </div>
  );
};

export default HomePage;

