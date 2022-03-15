from __future__ import annotations

import dataclasses
import typing

import strawberry



@strawberry.interface
class MutationProductMixin:
    field: str

