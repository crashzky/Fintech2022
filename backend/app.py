import strawberry as stb
from query import Query
from typs import SQLModel, engine
from mutation import Mutation

SQLModel.metadata.create_all(engine)

# strawberry server app -p 4000
schema = stb.Schema(query=Query, mutation=Mutation)