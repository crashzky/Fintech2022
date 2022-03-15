import fastapi
import strawberry.fastapi
import strawberry.http
import strawberry.schema.config
import strawberry.types


# Task requires only `message` field in errors
# and errors field only
class ChangedErrorStyleGraphQLRouter(strawberry.fastapi.GraphQLRouter):
    async def process_result(
        self,
        request: fastapi.Request,
        result: strawberry.types.ExecutionResult,
    ) -> strawberry.http.GraphQLHTTPResponse:
        response = strawberry.http.process_result(result)
        if response.get("errors"):
            needed_errors = []
            for error in response["errors"]:
                needed_errors.append({"message": error["message"]})

            response["errors"] = needed_errors
            del response["data"]

        return response
