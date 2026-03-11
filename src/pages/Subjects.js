import SubjectCard from '../components/SubjectCard';
import subjects from '../data/subjects';
import './Subjects.css';

export default function Subjects() {
  return (
    <div className="subjects-page">
      <div className="page-header">
        <h1>GCSE Subjects</h1>
        <p>Choose from our range of GCSE subjects, all taught by qualified specialists</p>
      </div>
      <div className="section-container">
        <div className="subjects-grid-full">
          {subjects.map(subject => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>
    </div>
  );
}
