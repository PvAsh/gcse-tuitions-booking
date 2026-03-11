import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaCalendarCheck, FaStar, FaUserGraduate } from 'react-icons/fa';
import SubjectCard from '../components/SubjectCard';
import subjects from '../data/subjects';
import './Home.css';

export default function Home() {
  const featuredSubjects = subjects.slice(0, 6);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Achieve Your Best <span className="highlight">GCSE Results</span></h1>
          <p>Expert one-to-one tuition tailored to your learning style. Our qualified tutors help you build confidence and master every topic.</p>
          <div className="hero-buttons">
            <Link to="/booking" className="btn-primary">Book a Session</Link>
            <Link to="/subjects" className="btn-secondary">Browse Subjects</Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong>500+</strong>
              <span>Students Helped</span>
            </div>
            <div className="stat">
              <strong>4.8</strong>
              <span>Average Rating</span>
            </div>
            <div className="stat">
              <strong>95%</strong>
              <span>Pass Rate</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-container">
          <h2>Why Choose GCSE Tuitions?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaChalkboardTeacher className="feature-icon" />
              <h3>Expert Tutors</h3>
              <p>All our tutors are qualified teachers or subject specialists with proven track records.</p>
            </div>
            <div className="feature-card">
              <FaCalendarCheck className="feature-icon" />
              <h3>Flexible Scheduling</h3>
              <p>Book sessions that fit your timetable, including evenings and weekends.</p>
            </div>
            <div className="feature-card">
              <FaStar className="feature-icon" />
              <h3>Personalised Learning</h3>
              <p>Lessons tailored to your exam board, learning style, and target grade.</p>
            </div>
            <div className="feature-card">
              <FaUserGraduate className="feature-icon" />
              <h3>Exam Preparation</h3>
              <p>Past paper practice, marking schemes, and exam technique coaching.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="subjects-preview">
        <div className="section-container">
          <h2>Popular Subjects</h2>
          <p className="section-subtitle">From Maths to Sciences, we cover all major GCSE subjects</p>
          <div className="subjects-grid">
            {featuredSubjects.map(subject => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
          <div className="center-link">
            <Link to="/subjects" className="btn-outline">View All Subjects</Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="section-container">
          <h2>Ready to Start?</h2>
          <p>Book your first session today and take the first step towards GCSE success.</p>
          <Link to="/register" className="btn-primary btn-lg">Get Started Free</Link>
        </div>
      </section>
    </div>
  );
}
