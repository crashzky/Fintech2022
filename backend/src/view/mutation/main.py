import strawberry

from src.view.mutation.product import MutationProductMixin


@strawberry.type
class Mutation(MutationProductMixin):
    field: str
