import { useNavigate } from 'react-router-dom';
import { FaCalculator, FaBook, FaBookOpen, FaLeaf, FaFlask, FaAtom, FaMicroscope, FaLandmark, FaGlobeEurope, FaLaptopCode } from 'react-icons/fa';
import './SubjectCard.css';

const iconMap = {
  calculator: FaCalculator,
  book: FaBook,
  'book-open': FaBookOpen,
  leaf: FaLeaf,
  flask: FaFlask,
  atom: FaAtom,
  microscope: FaMicroscope,
  landmark: FaLandmark,
  globe: FaGlobeEurope,
  laptop: FaLaptopCode,
};

export default function SubjectCard({ subject }) {
  const navigate = useNavigate();
  const Icon = iconMap[subject.icon] || FaBook;

  return (
    <div className="subject-card" onClick={() => navigate(`/booking?subject=${subject.id}`)}>
      <div className="subject-card-icon">
        <Icon />
      </div>
      <h3>{subject.name}</h3>
      <p>{subject.description}</p>
      <div className="subject-card-meta">
        <span className="subject-price">From £{subject.pricePerHour}/hr</span>
        <span className="subject-levels">{subject.levels.join(' | ')}</span>
      </div>
      <button className="btn-book-subject">Book Now</button>
    </div>
  );
}
