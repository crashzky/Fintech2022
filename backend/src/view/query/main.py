import strawberry

from src.view.query.product import QueryProductMixin


@strawberry.type
class Query(QueryProductMixin,):
    field: str
