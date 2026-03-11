import { useState } from 'react';
import TutorCard from '../components/TutorCard';
import tutors from '../data/tutors';
import subjects from '../data/subjects';
import './Tutors.css';

export default function Tutors() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? tutors
    : tutors.filter(t => t.subjects.includes(filter));

  return (
    <div className="tutors-page">
      <div className="page-header">
        <h1>Our Tutors</h1>
        <p>Meet our team of experienced and qualified GCSE tutors</p>
      </div>
      <div className="section-container">
        <div className="filter-bar">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Subjects
          </button>
          {subjects.map(s => (
            <button
              key={s.id}
              className={`filter-btn ${filter === s.id ? 'active' : ''}`}
              onClick={() => setFilter(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="tutors-list">
          {filtered.length === 0 ? (
            <p className="no-results">No tutors found for this subject.</p>
          ) : (
            filtered.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
