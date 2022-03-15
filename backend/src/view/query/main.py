import strawberry

from src.view.auth import Authentication


@strawberry.type
class Query:
    authentication: Authentication
