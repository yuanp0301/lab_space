"""Experiments module for AI Lab."""

from app.experiments.base import BaseExperiment, ExperimentConfig
from app.experiments.registry import get_experiment, get_experiments, register_experiment

__all__ = [
    "BaseExperiment",
    "ExperimentConfig",
    "register_experiment",
    "get_experiment",
    "get_experiments",
]
