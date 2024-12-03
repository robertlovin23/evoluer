from sqlalchemy import String, TIMESTAMP, func, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from . import db
import datetime

class Course(db.Model):
    __tablename__ = 'courses'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    mentor_id: Mapped[int] = mapped_column(ForeignKey('mentors.id'), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty_level: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g., Beginner, Intermediate, Advanced
    video_path: Mapped[str] = mapped_column(String(500), nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=True)  # Duration in hours
    created_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP, default=func.now())
    tags: Mapped[str] = mapped_column(String(200), nullable=True)  # Comma-separated tags

    mentor = relationship('Mentor', back_populates="courses")

    def to_dict(self):
        return {
            "id": self.id,
            "mentor_id": self.mentor_id,
            "title": self.title,
            "description": self.description,
            "difficulty_level": self.difficulty_level,
            "duration": self.duration,
            "video_path": self.video_path,
            "created_at": self.created_at,
            "tags": self.tags.split(",") if self.tags else [],
        }
