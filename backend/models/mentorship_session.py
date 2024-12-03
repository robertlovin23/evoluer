from sqlalchemy import String, TIMESTAMP, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from . import db
import datetime

class MentorshipSession(db.Model):
    __tablename__ = 'mentorship_sessions'

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey('students.id'), nullable=False)
    mentor_id: Mapped[int] = mapped_column(ForeignKey('mentors.id'), nullable=False)
    schedule: Mapped[datetime.datetime] = mapped_column(TIMESTAMP, nullable=False)
    notes: Mapped[str] = mapped_column(String(500), nullable=True)

    # Relationships with lazy evaluation
    student = relationship("Student", back_populates="mentorship_sessions")
    mentor = relationship("Mentor", back_populates="mentorship_sessions")

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "mentor_id": self.mentor_id,
            "schedule": self.schedule,
            "notes": self.notes
        }
