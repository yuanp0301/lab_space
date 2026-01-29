"""Files API endpoints for handling file uploads."""

import base64
import os
import uuid
from pathlib import Path

import aiofiles
from fastapi import APIRouter, HTTPException, UploadFile

from app.config import get_settings

router = APIRouter()


def get_upload_dir() -> Path:
    """Get and ensure upload directory exists."""
    settings = get_settings()
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir


@router.post("/upload")
async def upload_file(file: UploadFile):
    """Upload a file and return its ID and base64 data."""
    settings = get_settings()

    # Validate file size
    contents = await file.read()
    if len(contents) > settings.max_upload_size:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.max_upload_size} bytes",
        )

    # Validate content type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    content_type = file.content_type or "application/octet-stream"
    if content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {content_type}",
        )

    # Generate unique file ID
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename or "")[1] or ".jpg"
    filename = f"{file_id}{ext}"

    # Save file
    upload_dir = get_upload_dir()
    file_path = upload_dir / filename

    async with aiofiles.open(file_path, "wb") as f:
        await f.write(contents)

    # Return base64 encoded data for direct use
    base64_data = base64.b64encode(contents).decode("utf-8")

    return {
        "id": file_id,
        "filename": filename,
        "content_type": content_type,
        "size": len(contents),
        "base64": base64_data,
    }


@router.get("/{file_id}")
async def get_file_info(file_id: str):
    """Get information about an uploaded file."""
    upload_dir = get_upload_dir()

    # Find the file with any extension
    for file_path in upload_dir.glob(f"{file_id}.*"):
        if file_path.is_file():
            stat = file_path.stat()
            return {
                "id": file_id,
                "filename": file_path.name,
                "size": stat.st_size,
            }

    raise HTTPException(status_code=404, detail="File not found")


@router.delete("/{file_id}")
async def delete_file(file_id: str):
    """Delete an uploaded file."""
    upload_dir = get_upload_dir()

    # Find and delete the file
    for file_path in upload_dir.glob(f"{file_id}.*"):
        if file_path.is_file():
            file_path.unlink()
            return {"deleted": True, "id": file_id}

    raise HTTPException(status_code=404, detail="File not found")
