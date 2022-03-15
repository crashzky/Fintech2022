import fastapi
from fastapi.middleware.cors import CORSMiddleware

from src.controller.graphql import graphql_app
from src.event.startup import add_startup

main_app = fastapi.FastAPI()
main_app.add_route("/graphql", graphql_app)
main_app.add_websocket_route("/graphql", graphql_app)


add_startup(main_app)


main_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
