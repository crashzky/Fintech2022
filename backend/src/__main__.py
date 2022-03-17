import uvicorn

from src.config import get_uvicorn_settings

uvicorn.run(**get_uvicorn_settings())
