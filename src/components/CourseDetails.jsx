import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import courseData from '../data.json';
import quizData from '../quizData.json';

function CourseDetails() {
  const { courseId } = useParams();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [questCompleted, setQuestCompleted] = useState(false);

  const course = courseData.courses.find(c => c.id === parseInt(courseId));
  const quizzes = quizData.quizzes.find(q => q.courseId === parseInt(courseId));

  if (!course) {
    return <div>Course not found</div>;
  }

  const currentLesson = course.lessons[currentLessonIndex];
  const currentQuiz = quizzes?.lessons.find(l => l.lessonId === currentLesson.id)?.questions[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentLessonIndex]);

  useEffect(() => {
    if (timeSpent >= parseInt(currentLesson.duration.split(' ')[0]) * 60) {
      setShowQuiz(true);
    }
  }, [timeSpent, currentLesson]);

  useEffect(() => {
    if (quizCompleted) {
      setQuestCompleted(true);
      // Here you would typically update the user's progress and rewards in a real app
      console.log(`Quest completed for lesson ${currentLesson.id} in course ${courseId}`);
    }
  }, [quizCompleted]);

  const handleNextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setTimeSpent(0);
      setQuizCompleted(false);
      setShowQuiz(false);
      setSelectedAnswer(null);
      setQuizResult(null);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setTimeSpent(0);
      setQuizCompleted(false);
      setShowQuiz(false);
      setSelectedAnswer(null);
      setQuizResult(null);
    }
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
      setQuizResult(isCorrect);
      setQuizCompleted(isCorrect);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/explore" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">&larr; Back to Courses</Link>
      <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
      <p className="text-gray-600 mb-6">{course.description}</p>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">Lesson {currentLessonIndex + 1}: {currentLesson.title}</h3>
        <p className="text-gray-600 mb-4">{currentLesson.content}</p>
        <p className="text-sm text-gray-500 mb-2">Duration: {currentLesson.duration}</p>
        <p className="text-sm text-gray-500 mb-2">Time spent: {Math.floor(timeSpent / 60)}:{timeSpent % 60 < 10 ? '0' : ''}{timeSpent % 60}</p>
        {currentLesson.referenceLink && (
          <a 
            href={currentLesson.referenceLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            Learn More
          </a>
        )}
      </div>

      {showQuiz && !quizCompleted && currentQuiz && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold mb-4">Quiz</h4>
          <form onSubmit={handleQuizSubmit}>
            <p className="mb-4">{currentQuiz.question}</p>
            {currentQuiz.options.map((option, index) => (
              <div key={index} className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="quiz-answer"
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={() => setSelectedAnswer(index)}
                  />
                  <span className="ml-2">{option}</span>
                </label>
              </div>
            ))}
            <button 
              type="submit" 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 mt-4"
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </button>
          </form>
        </div>
      )}

      {quizResult !== null && (
        <div className={`bg-white shadow-md rounded-lg p-6 mb-6 ${quizResult ? 'bg-green-100' : 'bg-red-100'}`}>
          <h4 className="text-lg font-semibold mb-2">{quizResult ? 'Correct!' : 'Incorrect'}</h4>
          <p>{quizResult ? 'You can now proceed to the next lesson.' : 'Please review the lesson material and try again.'}</p>
        </div>
      )}
      
      {questCompleted && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p className="font-bold">Quest Completed!</p>
          <p>You've earned 10 $MOXIE tokens for completing this lesson and quiz.</p>
        </div>
      )}
      
      <div className="flex justify-between">
        <button 
          onClick={handlePreviousLesson} 
          disabled={currentLessonIndex === 0}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous Lesson
        </button>
        <button 
          onClick={handleNextLesson} 
          disabled={currentLessonIndex === course.lessons.length - 1 || !quizCompleted}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next Lesson
        </button>
      </div>
    </div>
  );
}

export default CourseDetails;
