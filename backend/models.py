from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class UserKeys(Base):
    __tablename__ = "user_keys"
    id = Column(Integer, primary_key=True, index=True)
    gemini_key = Column(String, nullable=False)
    foreign_api_key = Column(String, nullable=False)

class JobResult(Base):
    __tablename__ = "job_results"
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String, nullable=False)  # iran یا foreign
    result_json = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
