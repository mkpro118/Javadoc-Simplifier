from functools import wraps
from .export import export


@export
def memoize(func):
    cache = {}

    @wraps(func)
    def inner(*args, **kwargs):
        try:
            return cache[args]
        except KeyError:
            cache[args] = func(*args, **kwargs)
            return cache[args]

    return inner
