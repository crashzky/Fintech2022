import os


def get_debug() -> bool:
    var_value = os.getenv("GROCERY_SERVER_DEBUG")
    return var_value == "1"


def get_uvicorn_settings() -> dict:
    hot_reload = get_debug()
    settings = {
        "app": "src.controller.main:main_app",
        "host": "0.0.0.0",
        "port": 8000,
    }
    if hot_reload:
        settings.update(reload_dirs=["src"], reload=True)

    return settings
