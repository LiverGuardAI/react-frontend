import React, { useState, useEffect, useRef } from 'react';
import { Heart, TestTube, BarChart3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const featuresRef = useRef(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  const enterDashboard = () => {
    // Scroll down smoothly to features section first
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Add fade out effect
      const container = document.querySelector('.min-h-screen');
      setTimeout(() => {
        if (container) {
          container.style.transition = 'opacity 0.5s ease-out';
          container.style.opacity = '0';
        }
      }, 800);
    }

    // After scroll and fade animation, navigate based on authentication
    setTimeout(() => {
      if (isAuthenticated) {
        navigate('/page1');
      } else {
        navigate('/login');
      }
    }, 1300);
  };

  return (
      <div className="min-h-screen relative overflow-auto" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", sans-serif' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-blue-900/70 to-teal-900/70"></div>
        </div>

        <nav className="relative z-10 flex justify-between items-center p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Heart className="text-white" size={24} />
            </div>
            <span className="text-white text-2xl font-bold">LiverGuard</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/90 hover:text-white transition-colors hidden md:block">홈</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors hidden md:block">서비스</a>
            <a href="#" className="text-white/90 hover:text-white transition-colors hidden md:block">문의</a>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              회원가입
            </button>
          </div>
        </nav>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              당신의 건강을<br />
              <span className="text-blue-300">
                체계적으로 관리하세요
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto" style={{ fontWeight: 400, lineHeight: '1.6' }}>
              혈액검사 결과를 한눈에 확인하고, 전문적인 건강 분석으로 더 나은 내일을 준비하세요
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={enterDashboard}
                className="group px-8 py-4 bg-blue-600 text-white rounded-lg font-medium text-base hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                style={{ fontWeight: 500 }}
              >
                시작하기
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/page1');
                  } else {
                    navigate('/login');
                  }
                }}
                className="px-8 py-4 bg-white/15 backdrop-blur-sm text-white rounded-lg font-medium text-base hover:bg-white/25 transition-all border border-white/30"
                style={{ fontWeight: 500 }}>
                로그인
              </button>
            </div>
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto mb-16">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/25 hover:bg-white/20 transition-all">
              <div className="w-12 h-12 bg-blue-500/40 rounded-lg flex items-center justify-center mb-4">
                <TestTube className="text-white" size={22} />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2" style={{ fontWeight: 600 }}>정확한 분석</h3>
              <p className="text-white/80 text-sm" style={{ lineHeight: '1.6' }}>최신 의료 데이터 기반 혈액검사 결과 분석</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/25 hover:bg-white/20 transition-all">
              <div className="w-12 h-12 bg-blue-500/40 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-white" size={22} />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2" style={{ fontWeight: 600 }}>추이 모니터링</h3>
              <p className="text-white/80 text-sm" style={{ lineHeight: '1.6' }}>시간에 따른 건강 지표 변화 추적</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/25 hover:bg-white/20 transition-all">
              <div className="w-12 h-12 bg-blue-500/40 rounded-lg flex items-center justify-center mb-4">
                <Heart className="text-white" size={22} />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2" style={{ fontWeight: 600 }}>맞춤 관리</h3>
              <p className="text-white/80 text-sm" style={{ lineHeight: '1.6' }}>개인별 건강 상태에 따른 맞춤형 조언</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>
  );
};

export default Home;
