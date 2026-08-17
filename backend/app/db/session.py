from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DB_PATH = Path(__file__).resolve().parent / "fraud.db"
DATABASE_URL = f"sqlite:///{DB_PATH.as_posix()}"


class Base(DeclarativeBase):
    pass


engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    future=True,
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_sqlite_schema() -> None:
    if not DATABASE_URL.startswith("sqlite"):
        return

    with engine.begin() as conn:
        cols = conn.execute(text("PRAGMA table_info(users)")).fetchall()
        if cols:
            col_names = {row[1] for row in cols}
            if "role" not in col_names:
                conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'"))

        tx_cols = conn.execute(text("PRAGMA table_info(transactions)")).fetchall()
        if tx_cols:
            tx_col_names = {row[1] for row in tx_cols}
            if "receiver_name" not in tx_col_names:
                conn.execute(text("ALTER TABLE transactions ADD COLUMN receiver_name VARCHAR(120)"))
            if "receiver_account" not in tx_col_names:
                conn.execute(text("ALTER TABLE transactions ADD COLUMN receiver_account VARCHAR(64)"))
