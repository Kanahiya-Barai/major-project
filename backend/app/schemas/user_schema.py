from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: str = Field(default="user", pattern="^(user|admin)$")
    initial_balance: Decimal = Field(default=Decimal("1000.00"), ge=0)


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    balance: Decimal
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
