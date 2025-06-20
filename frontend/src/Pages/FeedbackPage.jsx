import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFeedback } from '../services/feedbackService';
import { isAuthenticated } from '../services/authService';
import { toast } from 'react-toastify';

const FeedbackPage = () => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      toast.info('Please sign in to leave feedback');
      navigate('/login', { state: { from: '/feedback' } });
      return;
    }
    
    if (comment.trim().length < 10) {
      toast.error('Please provide a more detailed comment (at least 10 characters)');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addFeedback({ rating, comment });
      toast.success('Thank you for your feedback! It will be reviewed shortly.');
      navigate('/');
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Glasses Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="absolute top-20 left-10 transform rotate-12">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="currentColor" className="text-gray-900">
            <path d="M20 20a15 15 0 0 1 30 0 15 15 0 0 1 30 0M5 20h10M65 20h10M35 20h10"/>
          </svg>
        </div>
        <div className="absolute top-1/3 right-20 transform -rotate-45">
          <svg width="60" height="30" viewBox="0 0 60 30" fill="currentColor" className="text-gray-900">
            <path d="M15 15a10 10 0 0 1 20 0 10 10 0 0 1 20 0M5 15h10M45 15h10M25 15h10"/>
          </svg>
        </div>
        <div className="absolute bottom-1/3 left-1/4 transform rotate-45">
          <svg width="70" height="35" viewBox="0 0 70 35" fill="currentColor" className="text-gray-900">
            <path d="M17.5 17.5a12.5 12.5 0 0 1 25 0 12.5 12.5 0 0 1 25 0M5 17.5h12.5M52.5 17.5h12.5M30 17.5h10"/>
          </svg>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
              Share Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-400 ml-3">
                Experience
              </span>
            </h1>
            <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto font-light leading-relaxed">
              We value your feedback to continually improve our services and products
            </p>
          </div>
        </div>
      </section>

      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl overflow-hidden p-8 transition-all duration-500 hover:shadow-2xl">
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  How would you rate your experience?
                </label>
                <div className="flex space-x-3 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform duration-300 hover:scale-125 focus:outline-none"
                      aria-label={`Rate ${star} stars`}
                    >
                      <svg 
                        className={`h-12 w-12 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <label htmlFor="comment" className="block text-lg font-semibold text-gray-800 mb-4">
                  Tell us about your experience
                </label>
                <textarea
                  id="comment"
                  rows="6"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                  placeholder="Share your thoughts, suggestions, or experiences with our products and services..."
                ></textarea>
                <p className="mt-2 text-sm text-gray-500">Minimum 10 characters required</p>
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative px-10 py-4 bg-black text-white rounded-full font-bold text-lg transition-all duration-500 hover:scale-105 hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : 'Submit Feedback'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;