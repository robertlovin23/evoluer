import bcrypt
from sqlalchemy import JSON, String, TIMESTAMP, func, DECIMAL
from sqlalchemy.orm import Mapped, mapped_column, relationship
from . import db
import datetime

class Mentor(db.Model):
    __tablename__ = 'mentors'
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    bio: Mapped[str] = mapped_column(String(100), nullable=True)
    expertise: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    availability: Mapped[JSON] = mapped_column(JSON, nullable=True)
    calendar_link: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP, default=func.now())
    price: Mapped[DECIMAL] = mapped_column(DECIMAL(10, 2), nullable=True)  # Updated price field

    # Lazy evaluation using string
    mentorship_sessions = relationship("MentorshipSession", back_populates="mentor")
    courses = relationship("Course", back_populates="mentor", cascade="all, delete-orphan")
    
    def set_password(self, password):
        """Hashes and sets the password."""
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        """Verifies the password."""
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "bio": self.bio,
            "email": self.email,
            "password": self.password,
            "expertise": self.expertise,
            "availability": self.availability,
            "calendar_link": self.calendar_link,
            "price": float(self.price) if self.price is not None else 0.0 ,
            "created_at": self.created_at
        }
