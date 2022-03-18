import typing

import fastapi
import strawberry.fastapi
import strawberry.http
import strawberry.schema.config
import strawberry.types
# Task requires only `message` field in errors
# and errors field only
from strawberry.asgi import GraphQL

errno = 0

class ChangedErrorStyleGraphQLRouter(GraphQL):
    async def process_result(
        self,
        request: fastapi.Request,
        result: strawberry.types.ExecutionResult,
    ) -> strawberry.http.GraphQLHTTPResponse:
        global errno
        print(await request.json())
        response = strawberry.http.process_result(result)
        if response.get("errors"):
            needed_errors = []
            for error in response["errors"]:
                needed_errors.append({"message": error["message"]})
                if "Room has rented contract in progress" == error["message"]:
                    errno += 1
                    response["data"] = {"errno": errno}

            response["errors"] = needed_errors

            # response["data"] = None
        print(response)
        return response

    async def get_context(
        self,
        request: typing.Union[fastapi.Request, fastapi.WebSocket],
        response: typing.Optional[fastapi.Response] = None,
    ) -> dict:
        return {"request": request, "response": response}
