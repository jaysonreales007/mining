import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseData from '../data.json';

function Quests() {
  const [quests, setQuests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questsPerPage = 6;

  useEffect(() => {
    // Generate quests based on courses and their lessons
    const generatedQuests = courseData.courses.flatMap(course => 
      course.lessons.map((lesson, index) => ({
        id: `${course.id}-${index}`,
        courseId: course.id,
        lessonId: lesson.id,
        title: `Complete "${lesson.title}"`,
        description: `Finish the lesson and pass the quiz for "${lesson.title}" in the "${course.title}" course.`,
        reward: Math.floor(Math.random() * 50) + 10, // Random reward between 10 and 59
        completed: false,
      }))
    );
    setQuests(generatedQuests);
  }, []);

  // Get current quests
  const indexOfLastQuest = currentPage * questsPerPage;
  const indexOfFirstQuest = indexOfLastQuest - questsPerPage;
  const currentQuests = quests.slice(indexOfFirstQuest, indexOfLastQuest);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Quests</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentQuests.map((quest, index) => (
          <div key={quest.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Quest {indexOfFirstQuest + index + 1}: {quest.title}</h3>
            <p className="text-gray-600 mb-4">{quest.description}</p>
            <p className="text-sm text-gray-500 mb-4">Reward: {quest.reward} $MOXIE</p>
            <Link 
              to={`/courses/${quest.courseId}`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 inline-block"
            >
              Start Quest
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          {Array.from({ length: Math.ceil(quests.length / questsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                ${currentPage === index + 1
                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }
              `}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Quests;
