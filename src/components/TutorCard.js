import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import subjects from '../data/subjects';
import './TutorCard.css';

export default function TutorCard({ tutor }) {
  const navigate = useNavigate();
  const tutorSubjects = tutor.subjects.map(
    sid => subjects.find(s => s.id === sid)?.name || sid
  );

  return (
    <div className="tutor-card">
      <div className="tutor-avatar">
        {tutor.photo ? (
          <img src={tutor.photo} alt={tutor.name} />
        ) : (
          <div className="tutor-initials">{tutor.initials}</div>
        )}
      </div>

      <div className="tutor-info">
        <h3>{tutor.name}</h3>
        <p className="tutor-quals">{tutor.qualifications}</p>
        <p className="tutor-bio">{tutor.bio}</p>

        <div className="tutor-subjects-list">
          {tutorSubjects.map(name => (
            <span key={name} className="subject-tag">{name}</span>
          ))}
        </div>

        <div className="tutor-footer">
          <div className="tutor-rating">
            <FaStar className="star-icon" />
            <span>{tutor.rating}</span>
            <span className="review-count">({tutor.reviewCount} reviews)</span>
          </div>
          <span className="tutor-price">£{tutor.pricePerHour}/hr</span>
          <button
            className="btn-book-tutor"
            onClick={() => navigate(`/booking?tutor=${tutor.id}`)}
          >
            Book Session
          </button>
        </div>
      </div>
    </div>
  );
}
