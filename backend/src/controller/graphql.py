import strawberry

from src.styled_errors import ChangedErrorStyleGraphQLRouter
from src.view.mutation.main import Mutation
from src.view.query.main import Query

schema = strawberry.Schema(Query, Mutation, extensions=[])
graphql_app = ChangedErrorStyleGraphQLRouter(schema, path="/graphql")
