import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="space-y-3">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-white text-3xl font-bold">P</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PetLanka</h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Sri Lanka's trusted platform for pet adoption and rehoming
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-primary text-white py-4 rounded-2xl text-base font-semibold hover:bg-primary-dark transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full border-2 border-primary text-primary py-4 rounded-2xl text-base font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
