from __future__ import annotations

import typing

import strawberry



@strawberry.interface
class QueryProductMixin:
    field: str
