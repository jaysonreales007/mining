import React from 'react';
import { Link } from 'react-router-dom';
import courseData from '../data.json';

function Courses() {
  const { courses } = courseData;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Difficulty: {course.difficulty}</p>
              <p className="text-sm text-gray-500">Duration: {course.duration}</p>
              <p className="text-sm text-gray-500">Rewards: {course.rewards} $MOXIE</p>
              <p className="text-sm text-gray-500">Lessons: {course.totalLessons}</p>
            </div>
            <Link 
              to={`/courses/${course.id}`}
              className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700 transition duration-300 inline-block text-center"
            >
              Start Course
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Courses;
