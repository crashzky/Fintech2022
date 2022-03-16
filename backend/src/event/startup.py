import fastapi


def add_startup(app: fastapi.FastAPI):
    @app.on_event("startup")
    def startup():
        pass
