"""Experiment registry for automatic discovery and registration."""

import importlib
import pkgutil
from pathlib import Path
from typing import TypeVar

from app.experiments.base import BaseExperiment

T = TypeVar("T", bound=BaseExperiment)

# Global registry of experiments
_registry: dict[str, type[BaseExperiment]] = {}


def register_experiment(cls: type[T]) -> type[T]:
    """Decorator to register an experiment class.

    Usage:
        @register_experiment
        class MyExperiment(BaseExperiment):
            config = ExperimentConfig(...)
    """
    if not issubclass(cls, BaseExperiment):
        raise TypeError(f"{cls.__name__} must be a subclass of BaseExperiment")

    if not hasattr(cls, "config"):
        raise ValueError(f"{cls.__name__} must define a config attribute")

    experiment_id = cls.config.id
    if experiment_id in _registry:
        raise ValueError(f"Experiment with id '{experiment_id}' already registered")

    _registry[experiment_id] = cls
    return cls


def get_experiment(experiment_id: str) -> BaseExperiment | None:
    """Get an experiment instance by ID."""
    cls = _registry.get(experiment_id)
    if cls:
        return cls()
    return None


def get_experiments(category: str | None = None) -> list[BaseExperiment]:
    """Get all registered experiments, optionally filtered by category."""
    experiments = [cls() for cls in _registry.values()]

    if category:
        experiments = [e for e in experiments if e.config.category == category]

    return experiments


def get_experiment_ids() -> list[str]:
    """Get all registered experiment IDs."""
    return list(_registry.keys())


def clear_registry() -> None:
    """Clear the experiment registry. Useful for testing."""
    _registry.clear()


def discover_experiments() -> None:
    """Discover and import all experiment modules.

    This function walks through the experiments directory and imports
    all Python modules, which triggers the @register_experiment decorators.
    """
    experiments_dir = Path(__file__).parent

    # Categories to discover
    categories = ["llm", "multimodal", "agents", "traditional"]

    for category in categories:
        category_dir = experiments_dir / category
        if not category_dir.exists():
            continue

        # Import all modules in the category
        for _, module_name, _ in pkgutil.iter_modules([str(category_dir)]):
            module_path = f"app.experiments.{category}.{module_name}"
            try:
                importlib.import_module(module_path)
            except ImportError as e:
                print(f"Warning: Failed to import {module_path}: {e}")
