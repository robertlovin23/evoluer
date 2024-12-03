from sqlalchemy import String, TIMESTAMP, func, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
import bcrypt
from . import db
import datetime

class Student(db.Model):
    __tablename__ = 'students'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    skills: Mapped[str] = mapped_column(String(200), nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP, default=func.now())
    learning_plan: Mapped[String] = mapped_column(String, nullable=True)
    tags: Mapped[str] = mapped_column(String(200), nullable=True)  # Comma-separated tags
    stripe_customer_id: Mapped[str] = mapped_column(String(100), nullable=True)
    # Lazy evaluation using string
    mentorship_sessions = relationship("MentorshipSession", back_populates="student")

    def set_password(self, password):
        """Hash and set the password."""
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        """Verify the password."""
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "skills": self.skills,
            "learning_plan": self.learning_plan,
            "tags": self.tags,
            "created_at": self.created_at,
            "stripe_customer_id": self.stripe_customer_id,
        }
 