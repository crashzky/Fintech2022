import typing

import fastapi
import strawberry.fastapi
import strawberry.http
import strawberry.schema.config
import strawberry.types
# Task requires only `message` field in errors
# and errors field only
from strawberry.asgi import GraphQL


class ChangedErrorStyleGraphQLRouter(GraphQL):
    async def process_result(
        self,
        request: fastapi.Request,
        result: strawberry.types.ExecutionResult,
    ) -> strawberry.http.GraphQLHTTPResponse:
        print(await request.json())
        response = strawberry.http.process_result(result)
        if response.get("errors"):
            needed_errors = []
            for error in response["errors"]:
                needed_errors.append({"message": error["message"]})

            response["errors"] = needed_errors
            # response["data"] = None

        return response

    async def get_context(
        self,
        request: typing.Union[fastapi.Request, fastapi.WebSocket],
        response: typing.Optional[fastapi.Response] = None,
    ) -> dict:
        return {"request": request, "response": response}
